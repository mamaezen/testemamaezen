import {Capacitor} from'@capacitor/core';
import {MediaSession} from'@capgo/capacitor-media-session';

/**
 * Background Audio Service for Capacitor Native Apps
 * Enables audio playback when the app is in the background or screen is off
 */

interface AudioState {
 isPlaying: boolean;
 currentVideoId: string | null;
 volume: number;
 title?: string;
 artist?: string;
}

interface AudioMetadata {
 title?: string;
 artist?: string;
 artwork?: string;
}

interface AudioControlHandlers {
 play?: () => void;
 pause?: () => void;
 stop?: () => void;
}

class BackgroundAudioService {
 private static instance: BackgroundAudioService;
 private audioState: AudioState = {
 isPlaying: false,
 currentVideoId: null,
 volume: 70,
};
 private wakeLock: WakeLockSentinel | null = null;
 private keepAliveTimer: number | null = null;
 private controlHandlers: AudioControlHandlers = {};

 private constructor() {
 this.setupVisibilityHandler();
}

 public static getInstance(): BackgroundAudioService {
 if (!BackgroundAudioService.instance) {
 BackgroundAudioService.instance = new BackgroundAudioService();
}
 return BackgroundAudioService.instance;
}

 /**
 * Setup visibility change handler to maintain audio during background
 */
 private setupVisibilityHandler(): void {
 if (typeof document!=='undefined') {
 document.addEventListener('visibilitychange', () => {
 if (document.visibilityState ==='hidden'&& this.audioState.isPlaying) {
 this.requestWakeLock();
  this.setMediaPlaybackState('playing');
}
});
}
}

 /**
 * Request a wake lock to prevent the device from sleeping
 */
 private async requestWakeLock(): Promise<void> {
 if ('wakeLock'in navigator) {
 try {
 this.wakeLock = await (navigator as any).wakeLock.request('screen');
 console.log('Wake Lock acquired for background audio');
} catch (err) {
 console.log('Wake Lock not available:', err);
}
}
}

 /**
 * Release the wake lock when audio stops
 */
 private async releaseWakeLock(): Promise<void> {
 if (this.wakeLock) {
 try {
 await this.wakeLock.release();
 this.wakeLock = null;
 console.log('Wake Lock released');
} catch (err) {
 console.log('Error releasing wake lock:', err);
}
}
}

 private async setMediaPlaybackState(playbackState: 'none'|'paused'|'playing'): Promise<void> {
 try {
  await MediaSession.setPlaybackState({playbackState});
 } catch (err) {
  if (import.meta.env.DEV) console.log('Media session state unavailable:', err);
 }
}

 private async updateMediaSession(metadata?: AudioMetadata): Promise<void> {
 try {
  await MediaSession.setMetadata({
  title: metadata?.title ||'Mamãe Zen Music',
  artist: metadata?.artist ||'Mamãe Zen',
  album:'Mamãe Zen',
  artwork: metadata?.artwork ? [{src: metadata.artwork, sizes:'512x512', type:'image/png'}] : undefined,
 });
  await MediaSession.setActionHandler({action:'play'}, () => {
  this.controlHandlers.play?.();
  this.setMediaPlaybackState('playing');
 });
  await MediaSession.setActionHandler({action:'pause'}, () => {
  this.controlHandlers.pause?.();
  this.setMediaPlaybackState('paused');
 });
  await MediaSession.setActionHandler({action:'stop'}, () => {
  this.controlHandlers.stop?.();
  this.stopAudio();
 });
  await this.setMediaPlaybackState('playing');
 } catch (err) {
  if (import.meta.env.DEV) console.log('Media session unavailable:', err);
 }
}

 private startKeepAlive(): void {
 if (this.keepAliveTimer || typeof window ==='undefined') return;
 this.keepAliveTimer = window.setInterval(() => {
  if (this.audioState.isPlaying && document.visibilityState ==='hidden') {
  this.setMediaPlaybackState('playing');
 }
 }, 20000);
}

 private stopKeepAlive(): void {
 if (this.keepAliveTimer) {
  window.clearInterval(this.keepAliveTimer);
  this.keepAliveTimer = null;
 }
}

 /**
 * Check if running on native platform (iOS/Android via Capacitor)
 */
 public isNativePlatform(): boolean {
 return Capacitor.isNativePlatform();
}

 /**
 * Get the current platform
 */
 public getPlatform(): string {
 return Capacitor.getPlatform();
}

 /**
 * Start audio playback
 */
 public startAudio(videoId: string, metadata?: AudioMetadata): void {
 this.audioState = {
...this.audioState,
 isPlaying: true,
 currentVideoId: videoId,
 title: metadata?.title,
 artist: metadata?.artist,
};
 this.requestWakeLock();
 this.updateMediaSession(metadata);
 this.startKeepAlive();
}

 /**
 * Stop audio playback
 */
 public stopAudio(): void {
 this.audioState = {
...this.audioState,
 isPlaying: false,
 currentVideoId: null,
};
 this.releaseWakeLock();
 this.stopKeepAlive();
 this.setMediaPlaybackState('none');
}

 public pauseAudio(): void {
 this.audioState = {
...this.audioState,
 isPlaying: false,
};
 this.releaseWakeLock();
 this.stopKeepAlive();
 this.setMediaPlaybackState('paused');
}

 public setControlHandlers(handlers: AudioControlHandlers): void {
 this.controlHandlers = handlers;
}

 /**
 * Set volume
 */
 public setVolume(volume: number): void {
 this.audioState.volume = Math.max(0, Math.min(100, volume));
}

 /**
 * Get current audio state
 */
 public getState(): AudioState {
 return {...this.audioState};
}

 /**
 * Check if audio is currently playing
 */
 public isPlaying(): boolean {
 return this.audioState.isPlaying;
}
}

export const backgroundAudioService = BackgroundAudioService.getInstance();
export default BackgroundAudioService;
