-- 1. Permitir ativações sem chave (trial)
ALTER TABLE public.key_activations
  ALTER COLUMN license_key_id DROP NOT NULL;

-- 2. Coluna para identificar tipo de ativação
ALTER TABLE public.key_activations
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'key';

-- 3. Atualizar handle_new_user para conceder trial de 7 dias
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;

  -- Trial premium de 7 dias automático
  INSERT INTO public.key_activations (user_id, license_key_id, source, activated_at, expires_at)
  VALUES (NEW.id, NULL, 'trial', now(), now() + INTERVAL '7 days')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- 4. Garantir trigger ativo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Atualizar activate_license_key para sobrescrever trial e marcar source='key'
CREATE OR REPLACE FUNCTION public.activate_license_key(p_key text, p_device_id text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key_id UUID;
  v_existing RECORD;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Se já tem ativação paga válida, retorna
  SELECT * INTO v_existing FROM key_activations WHERE user_id = auth.uid();
  IF v_existing IS NOT NULL AND v_existing.expires_at > now() AND v_existing.source = 'key' THEN
    RETURN json_build_object('success', true, 'message', 'Already activated', 'expires_at', v_existing.expires_at);
  END IF;

  SELECT id INTO v_key_id FROM license_keys WHERE key = p_key AND is_used = false;
  IF v_key_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid or already used key');
  END IF;

  UPDATE license_keys SET is_used = true WHERE id = v_key_id;
  v_expires_at := now() + INTERVAL '360 days';

  DELETE FROM key_activations WHERE user_id = auth.uid();
  INSERT INTO key_activations (user_id, license_key_id, device_id, source, activated_at, expires_at)
  VALUES (auth.uid(), v_key_id, p_device_id, 'key', now(), v_expires_at);

  RETURN json_build_object('success', true, 'message', 'Key activated successfully', 'expires_at', v_expires_at);
END;
$$;