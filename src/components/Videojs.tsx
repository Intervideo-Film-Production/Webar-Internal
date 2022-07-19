import React, { useRef, useEffect, memo, useState, useMemo } from 'react';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface VideosJSProps {
  sources: string[];
  poster?: string;
  options?: Omit<VideoJsPlayerOptions, 'sources'>;
  onReady?: (player: VideoJsPlayer) => void;
  onMaxSize?: () => void;
}

const defaultOptions: Omit<VideoJsPlayerOptions, 'sources'> = {
  controls: true,
  responsive: true,
  // fluid: true,
  preload: 'auto',
}

const VideoJS = memo(({ sources, poster, options, onReady, onMaxSize }: VideosJSProps) => {
  const videoRef = useRef(null);
  const { t } = useTranslation();
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const [maxSize, setMaxSize] = useState(false);

  const videoSources = useMemo(() => sources.map(url => {
    // check if the file this a video
    const checkVideoExtension = /^.+\.(mp4|webm|ogv)$/gi.exec(url);
    if (!checkVideoExtension) {
      return null;
    } else {
      const [_url, extension] = checkVideoExtension;
      return {
        src: `${_url}#t=0.1`,
        type: `video/${extension}`
      }
    }
  }).filter(s => !!s), [sources])

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const _options: VideoJsPlayerOptions = {
        ...defaultOptions,
        ...options,
        sources: videoSources as { src: string; type: string; }[],
        poster: poster,
        bigPlayButton: true,
        aspectRatio: '1:1'
      };

      const player = playerRef.current = videojs(videoElement, _options, () => {
        onReady && onReady(player);
      });
    }
  });

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    player?.on('play', () => {
      setMaxSize(true);
      player?.aspectRatio('16:9');
      if (onMaxSize) onMaxSize();
    })

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef, onMaxSize]);

  return videoSources.length > 0
    ? (<Grid sx={{
      float: 'left',
      minWidth: '50px',
      minHeight: '50px',
      ...(maxSize
        ? {
          width: '100%',
          marginBottom: '.5rem'
        }
        : {
          width: '50px',
          marginRight: '.5rem',
        }),
      transition: 'width 300ms ease-in-out'
    }}>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered" playsInline />
      </div>
    </Grid>)
    : (<Typography variant="subtitle1">{t('VideoIsNotSupported')}</Typography>)
});

export default VideoJS;
