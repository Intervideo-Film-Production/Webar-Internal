import React, { useRef, useEffect, memo, useMemo } from 'react';
import { Grid } from '@mui/material';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";

interface HomePageBackgroundProps {
  source?: string;
  onBackgroundDisplayable: () => void;
}

const defaultOptions: Omit<VideoJsPlayerOptions, 'sources'> = {
  controls: false,
  responsive: true,
  fluid: true,
  preload: 'auto',
  loop: false,
  autoplay: true,
  muted: true,
  bigPlayButton: false
}

const HomePageBackground = memo(({ source, onBackgroundDisplayable }: HomePageBackgroundProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  const videoSource = useMemo<videojs.Tech.SourceObject | null>(() => {
    if (!!source) {
      const checkVideoExtension = /^.+\.(mp4|webm|ogv)$/gi.exec(source);
      if (!checkVideoExtension) {
        return null;
      } else {
        const [_url, extension] = checkVideoExtension;
        return {
          src: _url,
          type: `video/${extension}`
        }
      }
    } else {
      return null;
    }


  }, [source])

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;
      // get aspect ratio from parent's size

      const _options: VideoJsPlayerOptions = {
        ...defaultOptions,
        sources: [],
      };

      playerRef.current = videojs(videoElement, _options, () => { });

      playerRef.current.on('canplaythrough', () => {
        if (onBackgroundDisplayable) onBackgroundDisplayable();
      })

      if (!!videoSource) {
        playerRef.current.src(videoSource.src);
        playerRef.current.play();
      }
    }
  }, [videoSource, onBackgroundDisplayable]);

  return (
    <Grid
      ref={wrapperRef}
      sx={{
        position: 'absolute',
        display: 'flex',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: 'transparent',
      }}>
      <div data-vjs-player style={{ background: 'transparent' }}>
        <video style={{
          objectFit: 'cover',
          background: 'transparent'
        }} className="video-js" ref={videoRef} playsInline autoPlay />
      </div>
    </Grid>)
});

export default HomePageBackground;
