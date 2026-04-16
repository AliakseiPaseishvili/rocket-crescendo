'use client';

import { FC, useEffect, useRef } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

export interface VideoPlayerProps {
  src: string;
  type?: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  fluid?: boolean;
  className?: string;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({
  src,
  type = 'video/mp4',
  poster,
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
  fluid = true,
  className,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoEl = document.createElement('video-js');
    videoEl.classList.add('vjs-big-play-centered');
    videoRef.current.appendChild(videoEl);

    const player = videojs(videoEl, {
      autoplay,
      controls,
      muted,
      loop,
      fluid,
      poster,
      sources: [{ src, type }],
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;
    player.src([{ src, type }]);
  }, [src, type]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;
    if (poster !== undefined) player.poster(poster);
  }, [poster]);

  return (
    <div
      ref={videoRef}
      data-vjs-player
      className={className}
    />
  );
};
