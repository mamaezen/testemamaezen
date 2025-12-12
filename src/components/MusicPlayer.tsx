import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music, Volume2, Square, Loader2, Library, Info } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCountry } from '@/contexts/CountryContext';
import { useYouTubeEmbed } from '@/hooks/useYouTubeEmbed';

interface Sound {
  id: string;
  name: string;
  nameEN: string;
  description: string;
  descriptionEN: string;
  youtubeId: string;
  icon: string;
  quality: string;
}

const sleepTracks: Sound[] = [
  {
    id: 'white-noise',
    name: 'Ruído Branco',
    nameEN: 'White Noise',
    description: 'Som contínuo que acalma o bebê',
    descriptionEN: 'Continuous sound that calms baby',
    youtubeId: 'nMfPqeZjc2c',
    icon: '🌊',
    quality: '10h 4K',
  },
  {
    id: 'rain',
    name: 'Chuva Suave',
    nameEN: 'Gentle Rain',
    description: 'Som relaxante de chuva caindo',
    descriptionEN: 'Relaxing rain falling sound',
    youtubeId: 'mPZkdNFkNps',
    icon: '🌧️',
    quality: '10h 4K',
  },
  {
    id: 'heartbeat',
    name: 'Para você mamãe',
    nameEN: 'For you mom',
    description: 'Melodia especial para o coração',
    descriptionEN: 'Special melody for the heart',
    youtubeId: 'P9nd2GbmLWU',
    icon: '❤️',
    quality: 'Premium HD',
  },
  {
    id: 'lullaby',
    name: 'Canção de Ninar',
    nameEN: 'Lullaby',
    description: 'Melodia suave para dormir',
    descriptionEN: 'Soft melody for sleeping',
    youtubeId: 'sgfMb2WycDo',
    icon: '🎵',
    quality: 'HD',
  },
  {
    id: 'ocean',
    name: 'Ondas do Mar',
    nameEN: 'Ocean Waves',
    description: 'Som tranquilo do oceano',
    descriptionEN: 'Peaceful ocean sound',
    youtubeId: 'WHPEKLQID4U',
    icon: '🌊',
    quality: '12h 4K',
  },
  {
    id: 'wind',
    name: 'Vento Suave',
    nameEN: 'Gentle Wind',
    description: 'Brisa relaxante',
    descriptionEN: 'Relaxing breeze',
    youtubeId: 'wzjWIxXBs_s',
    icon: '💨',
    quality: '10h 4K',
  },
];

const MusicPlayer = () => {
  const { isUSA } = useCountry();
  const { 
    isPlaying, 
    currentVideoId, 
    isLoading, 
    isIOS,
    containerRef,
    play, 
    stop, 
  } = useYouTubeEmbed();

  const [volume, setVolume] = useState([70]);
  const currentTrack = sleepTracks.find(s => s.youtubeId === currentVideoId);

  const texts = {
    title: isUSA ? 'Mom Zen Music' : 'Mamãe Zen Music',
    subtitle: isUSA ? 'Premium Player' : 'Player Premium',
    library: isUSA ? 'Library' : 'Biblioteca',
    relaxingSounds: isUSA ? 'Relaxing Sounds' : 'Sons Relaxantes',
    playing: isUSA ? 'Playing' : 'Tocando',
    stopped: isUSA ? '⏹️ Playback stopped' : '⏹️ Reprodução parada',
    loading: isUSA ? 'Loading...' : 'Carregando...',
    tapToPlay: isUSA ? 'Tap ▶ on video to start' : 'Toque ▶ no vídeo para iniciar',
    premium: isUSA 
      ? 'YouTube audio that works on all devices - iPhone, Android, Xiaomi!'
      : 'Áudio do YouTube que funciona em todos os dispositivos - iPhone, Android, Xiaomi!',
  };

  const handleTrackSelect = (sound: Sound) => {
    if (currentVideoId === sound.youtubeId) {
      stop();
      toast.success(texts.stopped);
    } else {
      play(sound.youtubeId);
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

      {/* YouTube Player */}
      {currentVideoId && (
        <div className="px-4">
          <div 
            ref={containerRef} 
            className="rounded-xl overflow-hidden shadow-lg border border-white/10"
          />
          {isIOS && (
            <p className="text-center text-xs text-pink-300 mt-2 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" />
              {texts.tapToPlay}
            </p>
          )}
        </div>
      )}

      {/* Container oculto quando não há vídeo */}
      {!currentVideoId && (
        <div ref={containerRef} className="hidden" />
      )}

      {/* Content Area */}
      <div className="p-4 pt-2">
        <ScrollArea className="h-[280px] pr-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/80 mb-2">{texts.relaxingSounds}</h3>
            <div className="grid grid-cols-2 gap-2">
              {sleepTracks.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => handleTrackSelect(sound)}
                  disabled={isLoading}
                  className={`
                    relative p-4 rounded-xl transition-all duration-300 text-left
                    ${currentVideoId === sound.youtubeId
                      ? 'bg-gradient-to-br from-pink-600/40 to-purple-600/40 shadow-lg scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10'
                    }
                    ${isLoading ? 'opacity-70' : ''}
                  `}
                >
                  <div className="flex flex-col gap-2">
                    {isLoading && currentVideoId === sound.youtubeId ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <span className="text-3xl">{sound.icon}</span>
                    )}
                    <div>
                      <p className="font-semibold text-white text-sm leading-tight">
                        {isUSA ? sound.nameEN : sound.name}
                      </p>
                      <p className="text-xs text-white/50 mt-1">{sound.quality}</p>
                    </div>
                  </div>
                  {currentVideoId === sound.youtubeId && isPlaying && (
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
                    {isLoading ? texts.loading : `${texts.playing} • ${currentTrack.quality}`}
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleStop}
                className="h-10 w-10 text-white/60 hover:text-white hover:bg-white/10"
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-white/60 flex-shrink-0" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-white/60 w-10 text-right flex-shrink-0">{volume[0]}%</span>
            </div>
            <p className="text-[10px] text-white/40 text-center mt-2">
              {isUSA ? 'Use YouTube player controls for volume' : 'Use os controles do player do YouTube para volume'}
            </p>
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
