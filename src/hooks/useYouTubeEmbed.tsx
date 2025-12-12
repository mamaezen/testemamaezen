import { useState, useRef, useCallback, useEffect } from 'react';

interface YouTubeState {
  isPlaying: boolean;
  currentVideoId: string | null;
  volume: number;
  isLoading: boolean;
}

export const useYouTubeEmbed = () => {
  const [state, setState] = useState<YouTubeState>({
    isPlaying: false,
    currentVideoId: null,
    volume: 70,
    isLoading: false,
  });

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Detecta se é iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (iframeRef.current) {
        iframeRef.current.src = '';
        iframeRef.current.remove();
        iframeRef.current = null;
      }
    };
  }, []);

  const createIframe = useCallback((videoId: string) => {
    const container = containerRef.current;
    if (!container) {
      console.error('Container não encontrado');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    // Remove iframe anterior
    if (iframeRef.current) {
      iframeRef.current.src = '';
      iframeRef.current.remove();
      iframeRef.current = null;
    }

    // Cria novo iframe
    const iframe = document.createElement('iframe');
    iframe.id = `yt-embed-${Date.now()}`;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('playsinline', 'true');
    iframe.setAttribute('frameborder', '0');
    
    // iOS: player visível para usuário clicar play
    // Android/outros: player oculto com autoplay
    if (isIOS) {
      iframe.style.cssText = 'width:100%;height:200px;border-radius:12px;background:#000;';
    } else {
      iframe.style.cssText = 'width:100%;height:200px;border-radius:12px;background:#000;';
    }

    // Parâmetros do YouTube
    const params = new URLSearchParams({
      autoplay: isIOS ? '0' : '1', // iOS bloqueia autoplay
      mute: '0',
      controls: '1',
      playsinline: '1',
      rel: '0',
      modestbranding: '1',
      loop: '1',
      playlist: videoId, // Necessário para loop funcionar
      enablejsapi: '1',
      origin: window.location.origin,
      fs: '1',
    });

    iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    
    iframe.onload = () => {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        isPlaying: !isIOS, // Em iOS usuário precisa clicar play
        currentVideoId: videoId,
      }));
    };

    container.innerHTML = '';
    container.appendChild(iframe);
    iframeRef.current = iframe;
  }, [isIOS]);

  const play = useCallback((videoId: string) => {
    createIframe(videoId);
  }, [createIframe]);

  const stop = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = '';
      iframeRef.current.remove();
      iframeRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    setState({
      isPlaying: false,
      currentVideoId: null,
      volume: state.volume,
      isLoading: false,
    });
  }, [state.volume]);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
  }, []);

  return {
    isPlaying: state.isPlaying,
    currentVideoId: state.currentVideoId,
    volume: state.volume,
    isLoading: state.isLoading,
    isIOS,
    containerRef,
    play,
    stop,
    setVolume,
  };
};

export default useYouTubeEmbed;
