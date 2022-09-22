// // A React component for 8th Wall AFrame scenes. The scene HTML can be supplied, along with
// // any components or primitives that should be registered, and any image targets that should be
// // loaded if something other than the automatically loaded set is wanted. Passing
// // DISABLE_IMAGE_TARGETS will prevent any image targets from loading, including ones that would
// // otherwise enabled automatically.
import { memo, useMemo, useRef } from 'react';
import { Subject } from 'rxjs';
import { IButtonContent, IProduct } from 'src/core/declarations/app';
import { useAppContext } from 'src/core/store';
import { modelRef } from 'src/core/declarations/enum';
import arView from "src/views/ar.view.html";
import { AframeComponent, AFrameScene, AframeSystem } from './aframeScene';
import { useEnableButtonsFromExternalEvent, useInsertButtonOverlays, useInsertButtons, useInsertButtonSound, useInsertModel, useMaxTouchPoints, useTriggerExternalEffectAndSound, useTriggerOverLay, useWatchRecenterEvent } from './aframeHooks';
import { cubeEnvMapComponent } from './8thwallComponents/cubemap-static';
import { changeColorComponent, annotationComponent, absPinchScaleComponent, proximityComponent, gltfMorphComponent, ignoreRaycast } from './8thwallComponents/absoluteScalesComponent';
import { cubeMapRealtimeComponent } from './8thwallComponents/cubemap-realtime';
import { responsiveImmersiveComponent } from './8thwallComponents/responsive-immersive';
import { xrLightComponent, xrLightSystem } from './8thwallComponents/xrlight';
import { Box, Grid } from '@mui/material';

const script8thWallDisabled = process.env.REACT_APP_8THWALL_DISABLED

interface IARAsceneComponentsGenerator {
  (
    realityReadyEvent: Subject<boolean>,
    modelLoadedEvent: Subject<boolean>,
  ): Array<AframeComponent>;
}

const arSceneComponentsGenerator: IARAsceneComponentsGenerator = (realityReadyEvent, modelLoadedEvent) => {
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
    { name: 'change-color', val: changeColorComponent },
    { name: 'annotation', val: annotationComponent },
    { name: 'absolute-pinch-scale', val: absPinchScaleComponent },
    { name: 'proximity', val: proximityComponent },
    { name: 'gltf-morph', val: gltfMorphComponent },
    { name: 'ignore-raycast', val: ignoreRaycast },
    { name: 'cubemap-realtime', val: cubeMapRealtimeComponent },
    { name: 'cubemap-static', val: cubeEnvMapComponent },
    { name: 'responsive-immersive', val: responsiveImmersiveComponent },
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

// AFRAME.registerComponent('change-color',
//   changeColorComponent)
// AFRAME.registerComponent('annotation',
//   annotationComponent)
// AFRAME.registerComponent('absolute-pinch-scale',
//   absPinchScaleComponent)
// AFRAME.registerComponent('proximity',
//   proximityComponent)
// AFRAME.registerComponent('gltf-morph',
//   gltfMorphComponent)
// AFRAME.registerComponent('ignore-raycast',
//   ignoreRaycast)
// AFRAME.registerComponent('cubemap-realtime',
//   cubeMapRealtimeComponent)
// AFRAME.registerComponent('cubemap-static',
//   cubeEnvMapComponent)
// AFRAME.registerComponent('responsive-immersive',
//   responsiveImmersiveComponent)
// AFRAME.registerComponent('xr-light',
//   xrLightComponent)
// AFRAME.registerSystem('xr-light',
//   xrLightSystem)


interface AFrameComponentProps {
  productDataSub: Subject<Partial<IProduct>>;
  buttonListSub: Subject<IButtonContent[]>;
  // beardStylesSub: Subject<IBeardStyle[]>;
  recenterEvent?: Subject<any>;
  onButtonClick: (buttonName: string) => any;
  buttonToggleEvent?: Subject<string>;
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
    // beardStylesSub,
    // beardStyleEvent,
    // switchBeardStyleEvent
  } = props;

  const buttonHandleEventRef = useRef(new Subject<string>());
  const { arResourcesLoadEvent, aFrameModelLoadedEvent } = useAppContext();

  const registerComponents = useMemo(
    () => arSceneComponentsGenerator(arResourcesLoadEvent, aFrameModelLoadedEvent),
    [arResourcesLoadEvent, aFrameModelLoadedEvent]
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
