import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, Volume2, Square, Loader2, Library } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCountry } from '@/contexts/CountryContext';
import { useNativeAudio } from '@/hooks/useNativeAudio';

interface Sound {
  id: string;
  name: string;
  nameEN: string;
  description: string;
  descriptionEN: string;
  icon: string;
  duration: string;
}

const sleepTracks: Sound[] = [
  {
    id: 'white-noise',
    name: 'Ruído Branco',
    nameEN: 'White Noise',
    description: 'Som contínuo que acalma o bebê',
    descriptionEN: 'Continuous sound that calms baby',
    icon: '🌊',
    duration: '∞ Loop',
  },
  {
    id: 'rain',
    name: 'Chuva Suave',
    nameEN: 'Gentle Rain',
    description: 'Som relaxante de chuva caindo',
    descriptionEN: 'Relaxing rain falling sound',
    icon: '🌧️',
    duration: '∞ Loop',
  },
  {
    id: 'heartbeat',
    name: 'Para você mamãe',
    nameEN: 'For you mom',
    description: 'Melodia especial para o coração',
    descriptionEN: 'Special melody for the heart',
    icon: '❤️',
    duration: '∞ Loop',
  },
  {
    id: 'lullaby',
    name: 'Canção de Ninar',
    nameEN: 'Lullaby',
    description: 'Melodia suave para dormir',
    descriptionEN: 'Soft melody for sleeping',
    icon: '🎵',
    duration: '∞ Loop',
  },
  {
    id: 'ocean',
    name: 'Ondas do Mar',
    nameEN: 'Ocean Waves',
    description: 'Som tranquilo do oceano',
    descriptionEN: 'Peaceful ocean sound',
    icon: '🌊',
    duration: '∞ Loop',
  },
  {
    id: 'wind',
    name: 'Vento Suave',
    nameEN: 'Gentle Wind',
    description: 'Brisa relaxante',
    descriptionEN: 'Relaxing breeze',
    icon: '💨',
    duration: '∞ Loop',
  },
];

const MusicPlayer = () => {
  const { isUSA } = useCountry();
  const { 
    isPlaying, 
    currentSoundId, 
    volume: audioVolume, 
    isLoading, 
    error,
    play, 
    stop, 
    setVolume, 
    togglePlayPause 
  } = useNativeAudio();

  const [localVolume, setLocalVolume] = useState([70]);

  // Sincroniza volume
  useEffect(() => {
    setVolume(localVolume[0] / 100);
  }, [localVolume, setVolume]);

  // Mostra erro se houver
  useEffect(() => {
    if (error) {
      toast.info(error);
    }
  }, [error]);

  const currentTrack = sleepTracks.find(s => s.id === currentSoundId);

  const texts = {
    title: isUSA ? 'Mom Zen Music' : 'Mamãe Zen Music',
    subtitle: isUSA ? 'Premium Player' : 'Player Premium',
    library: isUSA ? 'Library' : 'Biblioteca',
    relaxingSounds: isUSA ? 'Relaxing Sounds' : 'Sons Relaxantes',
    playing: isUSA ? 'Playing' : 'Tocando',
    stopped: isUSA ? '⏹️ Playback stopped' : '⏹️ Reprodução parada',
    loading: isUSA ? 'Loading...' : 'Carregando...',
    premium: isUSA 
      ? 'High-quality audio that works on all devices - iPhone, Android, Xiaomi!'
      : 'Áudio de alta qualidade que funciona em todos os dispositivos - iPhone, Android, Xiaomi!',
  };

  const handleTrackSelect = (sound: Sound) => {
    if (currentSoundId === sound.id) {
      if (isPlaying) {
        stop();
        toast.success(texts.stopped);
      } else {
        play(sound.id);
      }
    } else {
      play(sound.id);
      const name = isUSA ? sound.nameEN : sound.name;
      toast.success(`🎵 ${texts.playing}: ${name}`);
    }
  };

  const handleStop = () => {
    stop();
    toast.success(texts.stopped);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-950/90 via-pink-950/90 to-blue-950/90">
      {/* Header */}
      <div className="bg-gradient-to-b from-black/40 to-transparent p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{texts.title}</h2>
            <p className="text-xs text-white/60">{texts.subtitle}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="text-xs"
          >
            <Library className="w-3 h-3 mr-1" />
            {texts.library}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 pt-2">
        <ScrollArea className="h-[350px] pr-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/80 mb-2">{texts.relaxingSounds}</h3>
            <div className="grid grid-cols-2 gap-2">
              {sleepTracks.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => handleTrackSelect(sound)}
                  disabled={isLoading && currentSoundId === sound.id}
                  className={`
                    relative p-4 rounded-xl transition-all duration-300 text-left
                    ${currentSoundId === sound.id
                      ? 'bg-gradient-to-br from-pink-600/40 to-purple-600/40 shadow-lg scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10'
                    }
                    ${isLoading && currentSoundId === sound.id ? 'opacity-70' : ''}
                  `}
                >
                  <div className="flex flex-col gap-2">
                    {isLoading && currentSoundId === sound.id ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <span className="text-3xl">{sound.icon}</span>
                    )}
                    <div>
                      <p className="font-semibold text-white text-sm leading-tight">
                        {isUSA ? sound.nameEN : sound.name}
                      </p>
                      <p className="text-xs text-white/50 mt-1">{sound.duration}</p>
                    </div>
                  </div>
                  {currentSoundId === sound.id && isPlaying && (
                    <div className="absolute top-2 right-2">
                      <div className="flex gap-0.5">
                        <div className="w-1 h-4 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                        <div className="w-1 h-4 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_0.2s_infinite]" />
                        <div className="w-1 h-4 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_0.4s_infinite]" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Player Controls */}
        {currentTrack && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{currentTrack.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white text-sm truncate">
                    {isUSA ? currentTrack.nameEN : currentTrack.name}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {isLoading ? texts.loading : (isPlaying ? texts.playing : '⏸️ Pausado')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="icon"
                  disabled={isLoading}
                  onClick={togglePlayPause}
                  className={`
                    h-10 w-10 rounded-full transition-all
                    ${isPlaying ? 'bg-white text-purple-900 hover:bg-white/90' : 'bg-white/20 text-white hover:bg-white/30'}
                  `}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleStop}
                  className="h-10 w-10 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Square className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-white/60 flex-shrink-0" />
              <Slider
                value={localVolume}
                onValueChange={setLocalVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-white/60 w-10 text-right flex-shrink-0">{localVolume[0]}%</span>
            </div>
          </div>
        )}

        {/* Premium Badge */}
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <p className="text-xs text-white/80">
            <strong className="text-green-400">✅ Premium:</strong> {texts.premium}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MusicPlayer;
