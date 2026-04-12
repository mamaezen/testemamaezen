import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCountry } from '@/contexts/CountryContext';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Star, Baby, Key, Sparkles, ChevronRight } from 'lucide-react';
import mamaeZenLogo from '@/assets/mamae-zen-logo.png';
import previewGuias from '@/assets/preview-guias.png';
import previewMusicas from '@/assets/preview-musicas.png';
import previewGravidez from '@/assets/preview-gravidez.png';
import previewEmergencia from '@/assets/preview-emergencia.png';
import previewLojinha from '@/assets/preview-lojinha.png';
import previewPlayer from '@/assets/preview-player.png';
import { toast } from 'sonner';
import CountrySelector from '@/components/CountrySelector';
import { checkRateLimit } from '@/utils/rateLimiter';

const features = [
  { image: previewGuias, labelPt: 'Guias do Bebê', labelEn: 'Baby Guides' },
  { image: previewMusicas, labelPt: 'Músicas', labelEn: 'Music' },
  { image: previewGravidez, labelPt: 'Gravidez', labelEn: 'Pregnancy' },
  { image: previewEmergencia, labelPt: 'Emergência', labelEn: 'Emergency' },
  { image: previewLojinha, labelPt: 'Lojinha', labelEn: 'Shop' },
  { image: previewPlayer, labelPt: 'Player', labelEn: 'Player' },
];

const Login = () => {
  const { user, loading } = useAuth();
  const { isUSA } = useCountry();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [activatingKey, setActivatingKey] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  // Auto-rotate feature carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    const { allowed, retryAfterMs } = checkRateLimit('login');
    if (!allowed) {
      const seconds = Math.ceil(retryAfterMs / 1000);
      toast.error(
        isUSA
          ? `Too many attempts. Try again in ${seconds}s.`
          : `Muitas tentativas. Tente novamente em ${seconds}s.`
      );
      return;
    }

    setIsLoggingIn(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (error) {
        console.error('OAuth error:', error);
        toast.error(isUSA ? 'Login failed. Try again.' : 'Falha no login. Tente novamente.');
        setIsLoggingIn(false);
      }
    } catch (e) {
      console.error('OAuth exception:', e);
      toast.error(isUSA ? 'Login failed. Try again.' : 'Falha no login. Tente novamente.');
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/40 animate-pulse">
            <img src={mamaeZenLogo} alt="Mamãe Zen" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex flex-col relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-primary/15 blur-[120px] -top-48 -right-48 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-secondary/12 blur-[100px] -bottom-32 -left-32 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/10 blur-[90px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 relative z-10">
        
        {/* Logo & Brand */}
        <div className="text-center mb-6 space-y-3">
          <div className="relative inline-flex group">
            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-2xl shadow-primary/50 ring-2 ring-primary/20">
              <img src={mamaeZenLogo} alt="Mamãe Zen" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]">
                Mamãe Zen
              </span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
              {isUSA 
                ? 'The complete premium app for confident moms' 
                : 'O app premium completo para mamães confiantes'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Premium</span>
            <Star className="w-3 h-3 text-primary fill-primary" />
          </div>
        </div>

        {/* Feature showcase - 3-card spread */}
        <div className="w-full max-w-sm mb-6">
          <div className="relative h-[300px] flex items-center justify-center">
            {features.map((feat, i) => {
              const diff = (i - activeSlide + features.length) % features.length;
              const position = diff <= features.length / 2 ? diff : diff - features.length;
              const isActive = position === 0;
              const isAdjacent = Math.abs(position) === 1;
              const isVisible = Math.abs(position) <= 1;

              if (!isVisible) return null;

              return (
                <div
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className="absolute transition-all duration-500 ease-out cursor-pointer"
                  style={{
                    transform: `translateX(${position * 110}px) scale(${isActive ? 1 : 0.78}) translateZ(0)`,
                    zIndex: isActive ? 10 : 5,
                    opacity: isActive ? 1 : 0.5,
                    filter: isActive ? 'none' : 'brightness(0.6)',
                  }}
                >
                  <div className={`relative w-[160px] rounded-2xl overflow-hidden transition-shadow duration-500 ${
                    isActive 
                      ? 'shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.5)] ring-2 ring-primary/40' 
                      : 'shadow-xl ring-1 ring-border/20'
                  }`}>
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[6px] bg-background/80 rounded-b-lg z-20" />
                    <img 
                      src={feat.image} 
                      alt={isUSA ? feat.labelEn : feat.labelPt}
                      className="w-full h-[240px] object-cover object-top"
                    />
                  </div>
                  {isActive && (
                    <p className="mt-3 text-center text-sm font-bold text-foreground animate-in fade-in duration-300">
                      {isUSA ? feat.labelEn : feat.labelPt}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-1.5 -mt-2">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === i 
                    ? 'w-6 bg-primary' 
                    : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Login card */}
        <div className="w-full max-w-sm">
          <div className="relative p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-primary/30 space-y-6 shadow-[0_0_60px_-10px_hsl(var(--primary)/0.5),inset_0_1px_0_hsl(var(--primary)/0.1)]">
            
            {/* Card header with logo */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                <img src={mamaeZenLogo} alt="Mamãe Zen" className="w-full h-full object-cover" />
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold">
                  <span className="text-foreground">Mamãe</span>{' '}
                  <span className="text-primary">Zen</span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isUSA ? 'Access your account' : 'Acesse sua conta'}
                </p>
              </div>
            </div>

            {/* Google login button */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-70 gap-3"
              size="lg"
            >
              {isLoggingIn ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isLoggingIn 
                ? (isUSA ? 'Signing in...' : 'Entrando...') 
                : (isUSA ? 'Continue with Google' : 'Continuar com Google')}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">{isUSA ? 'or' : 'ou'}</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            {/* License Key */}
            {!showKeyInput ? (
              <Button
                variant="ghost"
                onClick={() => setShowKeyInput(true)}
                className="w-full h-14 rounded-xl border border-border/40 bg-muted/20 text-foreground hover:bg-muted/40 hover:border-border/60 transition-all gap-3 text-sm font-medium"
              >
                <Key className="w-4 h-4 text-primary" />
                {isUSA ? 'Enter License Key' : 'Entrar com Chave de Licença'}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                    value={licenseKey}
                    onChange={e => setLicenseKey(e.target.value.toUpperCase())}
                    maxLength={50}
                    className="h-14 rounded-xl bg-muted/20 border-border/40 pl-12 font-mono tracking-wider text-sm focus:border-primary/50"
                  />
                </div>
                <Button
                  onClick={async () => {
                    if (!licenseKey.trim()) return;
                    setActivatingKey(true);
                    toast.info(isUSA ? 'Please sign in with Google first, then your key will be activated automatically.' : 'Faça login com Google primeiro. Sua chave será ativada automaticamente após o login.');
                    sessionStorage.setItem('pending_license_key', licenseKey.trim());
                    setActivatingKey(false);
                    handleGoogleLogin();
                  }}
                  disabled={activatingKey || !licenseKey.trim()}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl gap-3 text-base"
                >
                  {activatingKey ? <Sparkles className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                  {isUSA ? 'Activate & Sign In' : 'Ativar e Entrar'}
                </Button>
                <button
                  onClick={() => { setShowKeyInput(false); setLicenseKey(''); }}
                  className="w-full text-xs text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {isUSA ? 'Cancel' : 'Cancelar'}
                </button>
              </div>
            )}

            {/* Toggle text */}
            <p className="text-center text-xs text-muted-foreground">
              {isUSA ? 'Have a key?' : 'Não tem conta?'}{' '}
              <button onClick={() => setShowKeyInput(!showKeyInput)} className="text-primary font-medium hover:underline">
                {showKeyInput 
                  ? (isUSA ? 'Use Google' : 'Usar Google') 
                  : (isUSA ? 'Use License Key' : 'Usar Chave')}
              </button>
            </p>
          </div>

          {/* Security badge & country */}
          <div className="flex items-center justify-between px-2 mt-4">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
              <Shield className="w-3 h-3" />
              <span>{isUSA ? 'Secure login' : 'Login seguro'}</span>
            </div>
            <div className="rounded-xl bg-card/20 backdrop-blur-sm border border-border/10 px-2 py-0.5">
              <CountrySelector />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-6 px-6 text-center space-y-1.5">
        <p className="text-[9px] text-muted-foreground/30">
          {isUSA ? 'By signing in you agree to our terms' : 'Ao entrar você concorda com nossos termos'}
        </p>
        <p className="text-[9px] text-muted-foreground/40 font-medium">
          © {new Date().getFullYear()} Mamãe Zen Premium
        </p>
      </div>
    </div>
  );
};

export default Login;
