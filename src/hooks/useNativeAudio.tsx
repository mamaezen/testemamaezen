import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioState {
  isPlaying: boolean;
  currentSoundId: string | null;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

// URLs de áudio gratuitos e confiáveis (sem API key necessária)
const AUDIO_SOURCES: Record<string, string[]> = {
  'white-noise': [
    'https://cdn.pixabay.com/audio/2024/11/04/audio_c4c8d4e4c2.mp3', // White noise
    'https://cdn.pixabay.com/audio/2022/03/10/audio_8cb749d484.mp3', // Backup
  ],
  'rain': [
    'https://cdn.pixabay.com/audio/2022/05/13/audio_257112181b.mp3', // Rain
    'https://cdn.pixabay.com/audio/2024/04/11/audio_ce3a249b59.mp3', // Backup rain
  ],
  'heartbeat': [
    'https://cdn.pixabay.com/audio/2022/10/18/audio_ae3048b4db.mp3', // Relaxing
    'https://cdn.pixabay.com/audio/2023/09/04/audio_d1a4f3f3c1.mp3', // Backup
  ],
  'lullaby': [
    'https://cdn.pixabay.com/audio/2023/10/30/audio_fcab969e23.mp3', // Lullaby
    'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3', // Backup
  ],
  'ocean': [
    'https://cdn.pixabay.com/audio/2024/09/03/audio_e2fdd3e7c4.mp3', // Ocean
    'https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3', // Backup
  ],
  'wind': [
    'https://cdn.pixabay.com/audio/2022/03/15/audio_942db6a5d4.mp3', // Wind
    'https://cdn.pixabay.com/audio/2024/02/28/audio_9a2379f4c3.mp3', // Backup
  ],
};

export const useNativeAudio = () => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentSoundId: null,
    volume: 0.7,
    isLoading: false,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSourceIndex = useRef<number>(0);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const tryNextSource = useCallback((soundId: string) => {
    const sources = AUDIO_SOURCES[soundId];
    if (!sources) return false;

    currentSourceIndex.current++;
    if (currentSourceIndex.current < sources.length) {
      const nextUrl = sources[currentSourceIndex.current];
      if (audioRef.current) {
        audioRef.current.src = nextUrl;
        audioRef.current.load();
        audioRef.current.play().catch(() => tryNextSource(soundId));
      }
      return true;
    }
    return false;
  }, []);

  const play = useCallback((soundId: string) => {
    const sources = AUDIO_SOURCES[soundId];
    if (!sources || sources.length === 0) {
      setState(prev => ({ ...prev, error: 'Som não encontrado' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    currentSourceIndex.current = 0;

    // Para áudio anterior
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // Cria novo elemento de áudio
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = state.volume;
    
    // Atributos para compatibilidade mobile
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');

    audio.oncanplaythrough = () => {
      setState(prev => ({ ...prev, isLoading: false }));
    };

    audio.onplay = () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        currentSoundId: soundId,
        isLoading: false,
        error: null,
      }));
    };

    audio.onpause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.onerror = () => {
      console.log(`Erro no source ${currentSourceIndex.current}, tentando próximo...`);
      if (!tryNextSource(soundId)) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Não foi possível carregar o áudio',
          isPlaying: false,
        }));
      }
    };

    audio.onended = () => {
      // Loop manual como fallback
      if (audio.loop) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
    };

    audio.src = sources[0];
    audioRef.current = audio;

    // Tenta reproduzir
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setState(prev => ({ 
            ...prev, 
            isPlaying: true, 
            currentSoundId: soundId,
            isLoading: false,
          }));
        })
        .catch((error) => {
          console.log('Autoplay bloqueado, aguardando interação:', error);
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            error: 'Toque novamente para reproduzir',
          }));
        });
    }
  }, [state.volume, tryNextSource]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    } else if (state.currentSoundId) {
      play(state.currentSoundId);
    }
  }, [state.currentSoundId, play]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setState({
      isPlaying: false,
      currentSoundId: null,
      volume: state.volume,
      isLoading: false,
      error: null,
    });
  }, [state.volume]);

  const setVolume = useCallback((volume: number) => {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    setState(prev => ({ ...prev, volume: normalizedVolume }));
    if (audioRef.current) {
      audioRef.current.volume = normalizedVolume;
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else if (state.currentSoundId) {
      resume();
    }
  }, [state.isPlaying, state.currentSoundId, pause, resume]);

  return {
    isPlaying: state.isPlaying,
    currentSoundId: state.currentSoundId,
    volume: state.volume,
    isLoading: state.isLoading,
    error: state.error,
    play,
    pause,
    resume,
    stop,
    setVolume,
    togglePlayPause,
  };
};

export default useNativeAudio;
