import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { Play, Pause, Volume2, Music, Square, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCountry } from "@/contexts/CountryContext";
import { useNativeAudio } from "@/hooks/useNativeAudio";

interface Sound {
  id: string;
  name: string;
  nameEN: string;
  description: string;
  descriptionEN: string;
  icon: string;
  duration: string;
}

const babySounds: Sound[] = [
  {
    id: "white-noise",
    name: "Ruído Branco",
    nameEN: "White Noise",
    description: "Som contínuo que acalma o bebê",
    descriptionEN: "Continuous sound that calms baby",
    icon: "🌊",
    duration: "∞ Loop"
  },
  {
    id: "rain",
    name: "Chuva Suave",
    nameEN: "Gentle Rain",
    description: "Som relaxante de chuva caindo",
    descriptionEN: "Relaxing rain falling sound",
    icon: "🌧️",
    duration: "∞ Loop"
  },
  {
    id: "heartbeat",
    name: "Para você mamãe",
    nameEN: "For you mom",
    description: "Melodia especial para o coração",
    descriptionEN: "Special melody for the heart",
    icon: "❤️",
    duration: "∞ Loop"
  },
  {
    id: "lullaby",
    name: "Canção de Ninar",
    nameEN: "Lullaby",
    description: "Melodia suave para dormir",
    descriptionEN: "Soft melody for sleeping",
    icon: "🎵",
    duration: "∞ Loop"
  },
  {
    id: "ocean",
    name: "Ondas do Mar",
    nameEN: "Ocean Waves",
    description: "Som tranquilo do oceano",
    descriptionEN: "Peaceful ocean sound",
    icon: "🌊",
    duration: "∞ Loop"
  },
  {
    id: "wind",
    name: "Vento Suave",
    nameEN: "Gentle Wind",
    description: "Brisa relaxante",
    descriptionEN: "Relaxing breeze",
    icon: "💨",
    duration: "∞ Loop"
  }
];

export default function BabySounds() {
  const { isUSA } = useCountry();
  const { 
    isPlaying, 
    currentSoundId, 
    volume, 
    isLoading, 
    error,
    play, 
    stop, 
    setVolume, 
    togglePlayPause 
  } = useNativeAudio();

  const [localVolume, setLocalVolume] = useState([70]);

  // Sincroniza volume local com hook
  useEffect(() => {
    setVolume(localVolume[0] / 100);
  }, [localVolume, setVolume]);

  // Mostra erro se houver
  useEffect(() => {
    if (error) {
      toast({
        title: isUSA ? "Notice" : "Aviso",
        description: error,
        variant: "default",
      });
    }
  }, [error, isUSA]);

  const currentSound = babySounds.find(s => s.id === currentSoundId);

  const texts = {
    title: isUSA ? 'Soothing Sounds momzen' : 'Sons Calmantes mamaezen',
    description: isUSA 
      ? 'Premium high-quality audio to calm and help baby sleep'
      : 'Áudios premium em alta qualidade para acalmar e fazer o bebê dormir',
    playing: isUSA ? '🎵 Playing...' : '🎵 Tocando...',
    paused: isUSA ? '⏸️ Paused' : '⏸️ Pausado',
    stopped: isUSA ? '⏹️ Stopped' : '⏹️ Parado',
    loading: isUSA ? 'Loading...' : 'Carregando...',
    premium: isUSA 
      ? '✨ momzen Premium: High-quality audio, continuous playback without interruptions. Works on all devices!'
      : '✨ mamaezen Premium: Áudios em alta qualidade, reprodução contínua sem interrupções. Funciona em todos os dispositivos!',
  };

  const handleSoundSelect = (sound: Sound) => {
    if (currentSoundId === sound.id) {
      if (isPlaying) {
        stop();
        toast({
          title: texts.stopped,
          description: isUSA ? "Playback ended" : "Reprodução encerrada",
        });
      } else {
        play(sound.id);
      }
    } else {
      play(sound.id);
      const name = isUSA ? sound.nameEN : sound.name;
      const desc = isUSA ? sound.descriptionEN : sound.description;
      toast({
        title: `🎵 ${name}`,
        description: desc,
      });
    }
  };

  const handleStop = () => {
    stop();
    toast({
      title: texts.stopped,
      description: isUSA ? "Playback ended" : "Reprodução encerrada",
    });
  };

  const getSoundName = (sound: Sound) => isUSA ? sound.nameEN : sound.name;

  return (
    <Card className="border-pink-500/20 shadow-lg bg-gradient-to-br from-purple-900/40 to-pink-900/40">
      <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-white">
          <Music className="w-5 h-5 text-pink-400" />
          {texts.title}
        </CardTitle>
        <CardDescription className="text-xs text-pink-200/70">
          {texts.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {babySounds.map((sound) => (
            <Button
              key={sound.id}
              variant={currentSoundId === sound.id ? "default" : "outline"}
              disabled={isLoading && currentSoundId === sound.id}
              className={`h-auto flex-col gap-1 p-3 relative text-xs transition-all ${
                currentSoundId === sound.id 
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white border-0 shadow-lg shadow-pink-500/30' 
                  : 'border-purple-500/30 text-pink-200 hover:bg-purple-500/20 hover:text-white'
              }`}
              onClick={() => handleSoundSelect(sound)}
            >
              {isLoading && currentSoundId === sound.id ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="text-2xl">{sound.icon}</span>
              )}
              <div className="text-center">
                <div className="font-semibold text-xs leading-tight">{getSoundName(sound)}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{sound.duration}</div>
              </div>
              {currentSoundId === sound.id && isPlaying && (
                <div className="absolute top-1 right-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                </div>
              )}
            </Button>
          ))}
        </div>

        {currentSound && (
          <div className="space-y-3 p-3 rounded-lg bg-[#1e1b4b] border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentSound.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-white">{getSoundName(currentSound)}</p>
                  <p className="text-xs text-pink-200/70">
                    {isLoading ? texts.loading : (isPlaying ? texts.playing : texts.paused)}
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button
                  size="icon"
                  disabled={isLoading}
                  className={`h-8 w-8 ${
                    isPlaying 
                      ? 'bg-white text-purple-900 hover:bg-white/90' 
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                  }`}
                  onClick={togglePlayPause}
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleStop}
                  className="h-8 w-8 border-purple-500/30 text-pink-200 hover:bg-purple-500/20"
                >
                  <Square className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Volume2 className="w-3 h-3 text-pink-200/70" />
                <Slider
                  value={localVolume}
                  onValueChange={setLocalVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-pink-200/70 w-10 text-right">
                  {localVolume[0]}%
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
          <p className="text-xs text-green-200">
            <strong className="text-green-400">✅</strong> {texts.premium}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
