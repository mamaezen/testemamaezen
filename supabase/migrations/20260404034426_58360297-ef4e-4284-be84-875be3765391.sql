
CREATE POLICY "Admins can insert license keys"
ON public.license_keys
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
