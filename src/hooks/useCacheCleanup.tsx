import { useEffect } from 'react';

// Limite máximo de entradas por categoria
const MAX_ENTRIES = 50;

// Chaves de localStorage que devem ser limitadas
const LIMITED_KEYS = ['sleepEntries', 'feedingEntries', 'notifications', 'musicCache', 'youtubeCache'];

// Limpa dados antigos e limita o tamanho do cache
const cleanupCache = () => {
  try {
    LIMITED_KEYS.forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (Array.isArray(data) && data.length > MAX_ENTRIES) {
            const trimmed = data.slice(0, MAX_ENTRIES);
            localStorage.setItem(key, JSON.stringify(trimmed));
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    });

    // Remove itens temporários e de cache
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('temp_') || key.startsWith('cache_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Limpa Cache API (service worker caches)
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  } catch (error) {
    console.error('Cache cleanup error:', error);
  }
};

// Limpa players de YouTube órfãos
const cleanupYouTubePlayers = () => {
  try {
    // Remove iframes de YouTube que possam estar órfãos
    const iframes = document.querySelectorAll('iframe[src*="youtube"]');
    iframes.forEach(iframe => {
      const parent = iframe.parentElement;
      if (parent && (parent.style.opacity === '0' || parent.style.display === 'none')) {
        iframe.remove();
      }
    });
  } catch (error) {
    console.error('YouTube cleanup error:', error);
  }
};

// Função para limpar tudo ao sair do app
const handleVisibilityChange = () => {
  if (document.visibilityState === 'hidden') {
    cleanupYouTubePlayers();
    // Salvar estado atual antes de sair
    sessionStorage.setItem('lastCleanup', Date.now().toString());
  }
};

// Função para limpar ao fechar/recarregar
const handleBeforeUnload = () => {
  cleanupYouTubePlayers();
  cleanupCache();
};

export const useCacheCleanup = () => {
  useEffect(() => {
    // Limpa cache na inicialização
    cleanupCache();
    
    // Limpa players órfãos
    cleanupYouTubePlayers();

    // Adiciona listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    // Cleanup periódico a cada 5 minutos
    const interval = setInterval(() => {
      cleanupCache();
      cleanupYouTubePlayers();
    }, 5 * 60 * 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      clearInterval(interval);
    };
  }, []);
};

export default useCacheCleanup;
