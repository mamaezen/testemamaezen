import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCountry } from '@/contexts/CountryContext';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import CountrySelector from '@/components/CountrySelector';

const Login = () => {
  const { user, loading } = useAuth();
  const { isUSA } = useCountry();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast.error(isUSA ? 'Login failed. Try again.' : 'Falha no login. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex items-center justify-center">
        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-8 bg-card/90 backdrop-blur-lg border-primary/20 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              {isUSA ? 'Mom Zen' : 'Mamãe Zen'}
            </h1>
            <Sparkles className="w-7 h-7 text-secondary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm">
            {isUSA ? '✨ Premium motherhood app ✨' : '✨ App premium de maternidade ✨'}
          </p>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary font-semibold text-xs border border-primary/30">
            PREMIUM
          </span>
        </div>

        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            {isUSA ? 'Sign in to access your premium experience' : 'Faça login para acessar sua experiência premium'}
          </p>

          <Button
            onClick={handleGoogleLogin}
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold text-base shadow-lg"
            size="lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {isUSA ? 'Sign in with Google' : 'Entrar com Google'}
          </Button>
        </div>

        <div className="pt-2">
          <CountrySelector />
        </div>

        <p className="text-[10px] text-center text-muted-foreground/60">
          {isUSA ? 'By signing in you agree to our terms' : 'Ao entrar você concorda com nossos termos'}
        </p>
      </Card>
    </div>
  );
};

export default Login;
