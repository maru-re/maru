export interface YouTubePlayerOptions {
  height: number
  width: number
  videoId: string
  playerVars?: Record<string, string | number>
  events?: {
    onReady?: (event: { target: YouTubePlayer }) => void
    onStateChange?: (event: { target: YouTubePlayer }) => void
    onError?: (error: any) => void
  }
}

export declare class YouTubePlayer {
  constructor(id: string | HTMLElement, options: YouTubePlayerOptions)

  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  seekTo(seconds: number, allowSeekAhead?: boolean): void
  getDuration(): number
  getCurrentTime(): number

  playVideoAt(index: number): void
  getPlayerState(): number
  destroy(): void
}

export interface YouTube {
  Player: typeof YouTubePlayer
  PlayerState: {
    ENDED: number
    PLAYING: number
    PAUSED: number
  }
}

declare global {
  interface Window {
    YT: YouTube
  }
}
