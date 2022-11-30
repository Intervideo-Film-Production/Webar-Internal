import React, { useRef, useMemo, useEffect, forwardRef } from 'react';
import { Observable } from 'rxjs';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import 'videojs-landscape-fullscreen';

const defaultOptions: VideoJsPlayerOptions = {
  controls: true,
  // responsive: true,
  fluid: true,
  preload: "auto",
  loop: false,
  autoplay: false,
  bigPlayButton: false
}

interface IPopupVideoContentProps {
  source: string;
  stopVideoEvent: Observable<void>;
}

const PopupVideoContent = forwardRef<VideoJsPlayer, IPopupVideoContentProps>(({ source, stopVideoEvent }, ref) => {
  const videoRef = useRef(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  const videoSource = useMemo(() => {

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
    const subscription = stopVideoEvent.subscribe(() => {
      playerRef.current?.pause();
    });

    return () => { subscription.unsubscribe(); }
  }, [stopVideoEvent])

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
      // FIXME not sure if needed
      // playerRef.current.landscapeFullscreen({
      //   fullscreen: {
      //     enterOnRotate: true,
      //     exitOnRotate: true,
      //     alwaysInLandscapeMode: true,
      //     iOS: true
      //   }
      // })

      if (!!videoSource) {
        playerRef.current.src(videoSource.src);
        playerRef.current?.play();
      }
    } else if (!!videoSource?.src) {
      playerRef.current?.src(videoSource.src);
      playerRef.current?.play();
    }

  }, [videoSource, ref]);

  return (
    <div data-vjs-player style={{ background: 'transparent' }}>
      <video style={{
        objectFit: 'cover',
        background: 'transparent'
      }} className="video-js" ref={videoRef} playsInline />
    </div>
  )

}
)
export default PopupVideoContent;
