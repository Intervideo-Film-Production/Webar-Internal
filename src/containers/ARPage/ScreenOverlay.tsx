import React, { useRef, useEffect, memo, useMemo } from 'react';
import { Grid } from '@mui/material';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import { useQueryClient } from 'react-query';
import { QueryKeys } from 'src/core/declarations/enum';
import { IButtonContent } from 'src/core/declarations/app';
import { isIOS } from 'src/core/helpers';

interface ScreenOverlayProps {
  buttonName: string;
}

const defaultOptions: Omit<VideoJsPlayerOptions, 'sources'> = {
  controls: false,
  responsive: true,
  fluid: true,
  preload: 'auto',
  loop: true,
  autoplay: true
}

const ScreenOverlay = memo(({ buttonName }: ScreenOverlayProps) => {
  const queryClient = useQueryClient();
  const buttonData = queryClient.getQueryData<IButtonContent[]>(QueryKeys.buttonAnimationContent);

  const screenOverlays = useMemo<{ [key: string]: { androidScreenOverlay: any, iosScreenOverlay: any } } | undefined>(() => {
    return buttonData?.reduce((a, b) => {
      const { buttonName, androidScreenOverlay, iosScreenOverlay } = b;
      return {
        ...a,
        [buttonName]: {
          androidScreenOverlay,
          iosScreenOverlay
        }
      }
    }, {})
  }, [buttonData])

  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  const videoSources = useMemo<videojs.Tech.SourceObject | null>(() => {

    if (screenOverlays && screenOverlays[buttonName]) {
      const buttonOverlays = screenOverlays[buttonName];
      const isAndroidDevice = typeof navigator !== 'undefined' && /Android/gi.test(navigator.userAgent);
      const isIOSDevice = isIOS();

      const source = (isAndroidDevice || isIOSDevice)
        ? (isAndroidDevice ? buttonOverlays.androidScreenOverlay : buttonOverlays.iosScreenOverlay) : '';

      // check if the file this a video
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

  }, [screenOverlays, buttonName])

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      // get aspect ratio from parent's size
      const scrollWidth = wrapperRef.current?.scrollWidth;
      const scrollHeight = wrapperRef.current?.scrollHeight;
      const _options: VideoJsPlayerOptions = {
        ...defaultOptions,
        aspectRatio: `${scrollWidth}:${scrollHeight}`,
        sources: [],
        bigPlayButton: false
      };

      playerRef.current = videojs(videoElement, _options, () => { });
    }
  }, []);

  useEffect(() => {
    if (playerRef.current && videoSources) {
      const currentSrc = playerRef.current.src();
      if (currentSrc !== videoSources.src) playerRef.current.src(videoSources.src);
    }
  }, [videoSources])

  return (
    <Grid
      ref={wrapperRef}
      sx={{
        position: 'fixed',
        display: 'flex',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: 'transparent',
        visibility: !!videoSources ? 'visible' : 'hidden'
      }}>
      <div data-vjs-player style={{ background: 'transparent' }}>
        <video style={{
          objectFit: 'cover',
          background: 'transparent'
        }} className="video-js" ref={videoRef} playsInline />
      </div>
    </Grid>)
});

export default ScreenOverlay;
