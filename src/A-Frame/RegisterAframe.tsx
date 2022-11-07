import React, { memo, useEffect } from 'react';
import { modelRef } from 'src/core/declarations/enum';
import { useAppContext } from 'src/core/store';
import { cubeEnvMapComponent } from './cubemap-static';
import { playVideoComponent } from './play-video';

declare let AFRAME: any;

const RegisterAframe = memo(() => {
  const { aFrameModelLoadedEvent, arResourcesLoadEvent } = useAppContext();

  useEffect(() => {
    const IS_IOS =
      /^(iPad|iPhone|iPod)/.test(window.navigator.userAgent) ||
      (/^Mac/.test(window.navigator.userAgent) && window.navigator.maxTouchPoints > 1)
    if (IS_IOS) {
      (window.createImageBitmap as any) = undefined
    }
  }, [])

  useEffect(() => {

    const realityReadyHandler = () => {
      arResourcesLoadEvent.next(true);
    }

    AFRAME.registerComponent(modelRef, {
      init: function () {
        let scene = this.el.sceneEl
        scene.addEventListener('realityready', realityReadyHandler);
        // Wait for model to load.
        this.el.addEventListener('model-loaded', () => {
          aFrameModelLoadedEvent.next(this.el);
        });
      },
      remove: function () {
        let scene = this.el.sceneEl
        scene.removeEventListener('realityready', realityReadyHandler);
      }
    });

    AFRAME.registerComponent('cubemap-static', cubeEnvMapComponent);
    AFRAME.registerComponent('play-video', playVideoComponent);

  })

  return (<></>)
})

export default RegisterAframe;
