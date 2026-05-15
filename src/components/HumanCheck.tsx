import { useState } from 'react';
import { Check, Loader2, Shield } from 'lucide-react';
import mamaeZenLogo from '@/assets/mamae-zen-logo.png';
import { useCountry } from '@/contexts/CountryContext';

interface HumanCheckProps {
  verified: boolean;
  onVerify: (ok: boolean) => void;
}

const HumanCheck = ({ verified, onVerify }: HumanCheckProps) => {
  const { isUSA } = useCountry();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (verified || loading) return;
    setLoading(true);
    // Pequeno delay para emular validação
    setTimeout(() => {
      setLoading(false);
      onVerify(true);
    }, 900);
  };

  return (
    <div className="w-full rounded-xl border border-primary/30 bg-card/40 backdrop-blur-md px-3 py-3 flex items-center gap-3 shadow-[0_0_20px_-8px_hsl(var(--primary)/0.4)]">
      <button
        type="button"
        onClick={handleClick}
        disabled={verified || loading}
        aria-checked={verified}
        role="checkbox"
        className={`relative w-7 h-7 shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
          verified
            ? 'bg-primary border-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]'
            : 'border-primary/50 bg-background/40 hover:border-primary active:scale-95'
        }`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        ) : verified ? (
          <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
        ) : null}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">
          {isUSA ? "I'm not a robot" : 'Não sou um robô'}
        </p>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
          <Shield className="w-2.5 h-2.5" />
          {isUSA ? 'Mamãe Zen security check' : 'Verificação Mamãe Zen'}
        </p>
      </div>

      <div className="flex flex-col items-center gap-0.5 pl-2 border-l border-border/30">
        <div className="w-7 h-7 rounded-md overflow-hidden ring-1 ring-primary/30">
          <img src={mamaeZenLogo} alt="Mamãe Zen" className="w-full h-full object-cover" />
        </div>
        <span className="text-[8px] font-bold tracking-wider text-primary/80 uppercase">Zen</span>
      </div>
    </div>
  );
};

export default HumanCheck;
