import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Moon, Sun, Sunset, Smile, Heart, BatteryLow, AlertCircle, PartyPopper, type LucideIcon } from 'lucide-react';
import { useCountry } from '@/contexts/CountryContext';

interface WelcomeGreetingProps {
  userName?: string;
  onMoodSelect?: (mood: string) => void;
}

const WelcomeGreeting = ({ userName = "Letícia", onMoodSelect }: WelcomeGreetingProps) => {
  const { isUSA } = useCountry();
  const [greeting, setGreeting] = useState({ text: '', icon: Sun, gradient: 'var(--gradient-morning)' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sanitizar o nome do usuário para prevenir XSS
  const sanitizedUserName = userName.replace(/[<>]/g, '').slice(0, 50);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting({
        text: isUSA ? `Good morning, ${sanitizedUserName}! 🌸` : `Bom dia, ${sanitizedUserName}! 🌸`,
        icon: Sun,
        gradient: 'var(--gradient-morning)'
      });
    } else if (hour >= 12 && hour < 18) {
      setGreeting({
        text: isUSA ? `Good afternoon, ${sanitizedUserName}! ☀️` : `Boa tarde, ${sanitizedUserName}! ☀️`,
        icon: Sunset,
        gradient: 'var(--gradient-calm)'
      });
    } else {
      setGreeting({
        text: isUSA ? `Good evening, ${sanitizedUserName}! 🌙` : `Boa noite, ${sanitizedUserName}! 🌙`,
        icon: Moon,
        gradient: 'var(--gradient-evening)'
      });
    }
  }, [currentTime, sanitizedUserName, isUSA]);

  const moods = isUSA ? [
    { emoji: '😊', label: 'Good', value: 'good' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😔', label: 'Tired', value: 'tired' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '🤗', label: 'Happy', value: 'happy' },
  ] : [
    { emoji: '😊', label: 'Bem', value: 'good' },
    { emoji: '😌', label: 'Tranquila', value: 'calm' },
    { emoji: '😔', label: 'Cansada', value: 'tired' },
    { emoji: '😰', label: 'Ansiosa', value: 'anxious' },
    { emoji: '🤗', label: 'Feliz', value: 'happy' },
  ];

  const GreetingIcon = greeting.icon;

  return (
    <Card 
      className="relative overflow-hidden border-0 shadow-lg"
      style={{ background: greeting.gradient }}
    >
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GreetingIcon className="w-6 h-6 text-white drop-shadow-lg" />
            <h1 className="text-lg font-bold text-white drop-shadow-lg">
              {greeting.text}
            </h1>
          </div>
          <Sparkles className="w-5 h-5 text-white/80 animate-pulse" />
        </div>
        
        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/40">
          <p className="text-white text-xs font-medium mb-2">
            {isUSA ? 'How are you feeling?' : 'Como está se sentindo?'}
          </p>
          
          <div className="grid grid-cols-5 gap-1.5">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => onMoodSelect?.(mood.value)}
                className="flex flex-col items-center gap-1 p-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-all active:scale-95 border border-white/50"
              >
                <span className="text-xl">{mood.emoji}</span>
                <span className="text-[10px] font-medium text-foreground leading-tight">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-white/90 text-xs mt-2 text-center font-medium">
          {currentTime.toLocaleTimeString(isUSA ? 'en-US' : 'pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
    </Card>
  );
};

export default WelcomeGreeting;
