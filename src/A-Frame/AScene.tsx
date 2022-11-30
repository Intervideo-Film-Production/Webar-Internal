// // A React component for 8th Wall AFrame scenes. The scene HTML can be supplied, along with
// // any components or primitives that should be registered, and any image targets that should be
// // loaded if something other than the automatically loaded set is wanted. Passing
// // DISABLE_IMAGE_TARGETS will prevent any image targets from loading, including ones that would
// // otherwise enabled automatically.
import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import { filter, map, pairwise, skip, startWith, Subject, withLatestFrom, zip } from 'rxjs';
import { AFrameElement, IBeardStyle, IButtonContent, IProduct, IProductColor } from 'src/core/declarations/app';
import { modelRef, ProductTypes } from 'src/core/declarations/enum';
import { Entity } from "aframe";
import arView from "./views/ar.view.html";
import { AframeComponent, AFrameScene, AframeSystem } from './aframeScene';

import {
  useEnableButtonsFromExternalEvent,
  useInsertButtonOverlays,
  useInsertButtons,
  useInsertButtonSound,
  useInsertHotspots,
  useInsertModel,
  useMaxTouchPoints,
  useTriggerExternalEffectAndSound,
  useTriggerOverLay,
  useWatchRecenterEvent
} from './hooks';
import {
  cubeEnvMapComponent,
  changeColorComponent,
  absPinchScaleComponent,
  proximityComponent,
  gltfMorphComponent,
  ignoreRaycast,
  responsiveImmersiveComponent,
  xrLightComponent,
  xrLightSystem,
  annotationComponent,
  cubeMapRealtimeComponent
} from './8thwallComponents';
import { useAppContext } from 'src/core/events';
import { useBoundStore } from 'src/core/store';
import { playVideoComponent } from './play-video';

declare var THREE: any;

const script8thWallDisabled = process.env.REACT_APP_8THWALL_DISABLED

// default light
// <a-entity position="-2 4 2" light="type: directional; color: white; intensity: 2.5"></a-entity>
// <a-entity light="type: ambient; color: white; intensity: 2;"></a-entity>

interface IARAsceneComponentsGenerator {
  (
    realityReadyEvent: Subject<boolean>,
    modelLoadedEvent: Subject<boolean>,
    productColorSub: Subject<IProductColor>

  ): Array<AframeComponent>;
}

const arSceneComponentsGenerator: IARAsceneComponentsGenerator = (realityReadyEvent, modelLoadedEvent, productColorSub) => {
  let readyReadyHandler: Function;
  let modelLoadedHandler: Function;

  return [
    // app components
    {
      name: "ar-view-initializer",
      val: {
        init: function () {
          let scene = this.el.sceneEl;

          readyReadyHandler = () => {
            realityReadyEvent.next(true);
          }

          scene.addEventListener("realityready", readyReadyHandler);
        },
        remove: function () {
          let scene = this.el.sceneEl;
          scene.removeEventListener("realityready", readyReadyHandler);
          realityReadyEvent.next(false);
          // FIXME
          // modelLoadedEvent.next(false);
        }
      }
    },
    {
      name: modelRef,
      val: {
        init: function () {
          modelLoadedHandler = () => {
            modelLoadedEvent.next(this.el);
          }
          this.el.addEventListener("model-loaded", modelLoadedHandler);
        },
        remove: function () {
          this.el.removeEventListener("realityready", modelLoadedHandler);
        }
      }
    },
    // 8thwall support components
    {
      name: "cubemap-static",
      val: cubeEnvMapComponent
    },
    // 8thwall absolute scale component
    { name: 'change-color', val: changeColorComponent(productColorSub) },
    { name: 'annotation', val: annotationComponent },
    { name: 'absolute-pinch-scale', val: absPinchScaleComponent },
    { name: 'proximity', val: proximityComponent },
    { name: 'gltf-morph', val: gltfMorphComponent },
    { name: 'play-video', val: playVideoComponent },
    { name: 'ignore-raycast', val: ignoreRaycast },
    { name: 'cubemap-realtime', val: cubeMapRealtimeComponent },
    { name: 'cubemap-static', val: cubeEnvMapComponent },
    { name: 'responsive-immersive', val: responsiveImmersiveComponent(modelLoadedEvent) },
    { name: 'xr-light', val: xrLightComponent },
  ]
}

const systems: AframeSystem[] = [
  // 8thwall absolute scale system
  {
    name: 'xr-light',
    val: xrLightSystem
  }
];

interface AFrameComponentProps {
  productDataSub: Subject<IProduct>;
  buttonListSub: Subject<IButtonContent[]>;
  beardStylesSub: Subject<IBeardStyle[]>;
  recenterEvent?: Subject<any>;
  onButtonClick: (buttonName: string) => any;
  buttonToggleEvent?: Subject<string>;
  beardStyleEvent?: Subject<boolean>;
  switchBeardStyleEvent?: Subject<IBeardStyle>;
  productColorSub: Subject<IProductColor>;
  // beardStyleEvent?: Subject<boolean>;
  // switchBeardStyleEvent?: Subject<string>;
}

const AScene = memo((props: AFrameComponentProps) => {
  const {
    productDataSub,
    buttonListSub,
    recenterEvent,
    buttonToggleEvent,
    onButtonClick,
    productColorSub,
    beardStylesSub,
    beardStyleEvent,
    switchBeardStyleEvent
  } = props;

  const hotspots = useBoundStore(state => state.product?.hotspots);
  const buttonHandleEventRef = useRef(new Subject<string>());

  // FIXME decide whether separate face effect?
  // keep here for now
  useEffect(() => {
    // beard styles
    const subscription = beardStylesSub.subscribe(beardStyles => {
      // remove previous beard styles
      document.querySelectorAll('xrextras-resource.beard-style-xr-resource').forEach(el => {
        el.remove();
      })

      document.querySelectorAll('xrextras-basic-material.beard-style-basic-material').forEach(el => {
        el.remove();
      })

      beardStyles.forEach(({ id, beardImage, faceEffectModel }) => {

        // inject image based face effect
        if (!!beardImage) {
          document.querySelector('a-scene')?.insertAdjacentHTML('beforeend',
            `<xrextras-resource class="beard-style-xr-resource" id="beard-${id}" src="${beardImage}"></xrextras-resource>
            <xrextras-basic-material class="beard-style-basic-material" id="paint-${id}" tex="#beard-${id}" alpha="#alpha-soft-eyes" opacity="0.9"></xrextras-basic-material>`
          );
        }

        // inject model based face effect
        if (!!faceEffectModel) {
          const assetContainer = document.getElementById("assetContainer");
          assetContainer?.insertAdjacentHTML('beforeend',
            `<a-asset-item id="mask-model-${id}" class="mask-model" src="${faceEffectModel}"></a-asset-item>`)
        }
      });
    })

    return () => { subscription.unsubscribe(); }

  }, [beardStylesSub])

  // FIXME face effect keep here for now
  useEffect(() => {
    if (beardStyleEvent) {
      const subscription = beardStyleEvent.pipe(
        skip(1),
        withLatestFrom(beardStylesSub),
        filter(([_, beardStyles]) => beardStyles.length > 0)
      ).subscribe(([isUsingFace, beardStyles]) => {

        const aFrameComponent = document.querySelector('a-scene');
        if (isUsingFace) {
          document.querySelector('#modelContainer')?.setAttribute('visible', 'false')
          if (!!aFrameComponent) {
            aFrameComponent.renderer.outputEncoding = THREE.LinearEncoding;
          }
          aFrameComponent?.removeAttribute('xrweb')
          aFrameComponent?.setAttribute('xrface', {
            mirroredDisplay: true,
            cameraDirection: 'front',
            meshGeometry: "eyes, face, mouth",
            allowedDevices: "any"
          })
          aFrameComponent?.insertAdjacentHTML('beforeend',
            ` 
                <xrextras-faceanchor id="face-effect">
                ${!!beardStyles[0].beardImage
              ? `<xrextras-face-mesh id="face-mesh" material-resource="#paint-${beardStyles[0].id}"></xrextras-face-mesh>`
              : `
                    <a-entity id="face" gltf-model="#head-occluder" position="0 0 0.02" xrextras-hider-material></a-entity>  
                    <xrextras-face-attachment point="${beardStyles[0].faceEffectModelAnchor}">
                    <a-entity 
                    gltf-model="#mask-model-${beardStyles[0].id}" 
                    rotation="${beardStyles[0].modelRotation}"
                    scale="${beardStyles[0].modelScale}" 
                    position="${beardStyles[0].modelPosition}"></a-entity>
                  </xrextras-face-attachment>`
            }
                </xrextras-faceanchor>

                <xrextras-capture-button capture-mode="photo"></xrextras-capture-button>
        
                <!-- configure capture settings -->
                <xrextras-capture-config
                  file-name-prefix="braun-image-"
                  request-mic="manual"
                ></xrextras-capture-config>
        
                <!-- add capture preview -->
                <xrextras-capture-preview></xrextras-capture-preview>
          
            `);


          // add camera button else where
          setTimeout(() => {
            const beardInteractionARea = document.querySelector('#beard-content-drawer');
            if (!!beardInteractionARea) {
              const offsetBottom = beardInteractionARea.getBoundingClientRect().height;
              const recorderButton = document.querySelector('#recorder.recorder-container');
              if (!!recorderButton) {
                recorderButton.setAttribute('style', `bottom: ${offsetBottom + 20}px !important;z-index: 3000;`);
              }
            }
          }, 50)
        }
        else {
          document.querySelector('#modelContainer')?.setAttribute('visible', 'true')
          if (!!aFrameComponent) {
            aFrameComponent.renderer.outputEncoding = THREE.sRGBEncoding;
          }
          const faceAnchor = document.querySelector('xrextras-faceanchor')
          faceAnchor?.parentNode?.removeChild(faceAnchor)
          aFrameComponent?.removeAttribute('xrface')
          aFrameComponent?.setAttribute('xrweb', '')

          //remove screenshot button
          const captureButton = document.querySelector('xrextras-capture-button');
          captureButton?.parentNode?.removeChild(captureButton);
          const captureButtonConfig = document.querySelector('xrextras-capture-config');
          captureButtonConfig?.parentNode?.removeChild(captureButtonConfig);
          const captureButtonPrev = document.querySelector('xrextras-capture-preview');
          captureButtonPrev?.parentNode?.removeChild(captureButtonPrev);

        }

      });

      return () => subscription.unsubscribe();

    }
  }, [beardStyleEvent, beardStylesSub])

  // FIXME face effect keep here for now
  useEffect(() => {
    if (switchBeardStyleEvent) {
      const subscription = switchBeardStyleEvent.subscribe(beardStyle => {
        // FIXME
        // const aFrameComponent = aFrameComponentRef.current;

        const faceEffectContainer = document.getElementById("face-effect");
        if (!!faceEffectContainer) {
          faceEffectContainer.innerHTML = "";
          faceEffectContainer.insertAdjacentHTML('beforeend',
            !!beardStyle.beardImage
              ? `<xrextras-face-mesh id="face-mesh" material-resource="#paint-${beardStyle.id}"></xrextras-face-mesh>`
              : `
                  <a-entity id="face" gltf-model="#head-occluder" position="0 0 0.02" xrextras-hider-material></a-entity>  
                  <xrextras-face-attachment point="${beardStyle.faceEffectModelAnchor}">
                  <a-entity 
                  gltf-model="#mask-model-${beardStyle.id}" 
                  rotation="${beardStyle.modelRotation}" 
                  scale="${beardStyle.modelScale}" 
                  position="${beardStyle.modelPosition}"></a-entity>
                </xrextras-face-attachment>`
          );
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [switchBeardStyleEvent])

  const { arResourcesLoadEvent, aFrameModelLoadedEvent } = useAppContext();

  const registerComponents = useMemo(
    () => arSceneComponentsGenerator(arResourcesLoadEvent, aFrameModelLoadedEvent, productColorSub),
    [arResourcesLoadEvent, aFrameModelLoadedEvent, productColorSub]
  );
  useMaxTouchPoints();
  useInsertModel(productDataSub);
  useInsertButtonOverlays(buttonListSub);
  useInsertButtonSound(buttonListSub);
  useInsertButtons(buttonListSub, buttonHandleEventRef.current);
  useTriggerOverLay(buttonListSub, buttonHandleEventRef.current);
  useTriggerExternalEffectAndSound(onButtonClick, buttonHandleEventRef.current);
  useEnableButtonsFromExternalEvent(buttonToggleEvent);
  useWatchRecenterEvent(recenterEvent);
  useInsertHotspots(aFrameModelLoadedEvent, hotspots);

  return script8thWallDisabled
    ? <></>
    : (
      <Box
        id="arSceneWrapper"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: window.innerHeight,
          width: window.innerWidth,
        }}
      >
        <AFrameScene components={registerComponents} systems={systems} sceneHtml={arView} wrapperId="arSceneWrapper" />
      </Box>
    )
});

const DISABLE_IMAGE_TARGETS: unknown[] = [];

export { AScene, DISABLE_IMAGE_TARGETS }
