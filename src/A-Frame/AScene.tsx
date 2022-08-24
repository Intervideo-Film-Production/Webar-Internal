// // A React component for 8th Wall AFrame scenes. The scene HTML can be supplied, along with
// // any components or primitives that should be registered, and any image targets that should be
// // loaded if something other than the automatically loaded set is wanted. Passing
// // DISABLE_IMAGE_TARGETS will prevent any image targets from loading, including ones that would
// // otherwise enabled automatically.
import React, { memo, useEffect, useMemo, useRef } from 'react';
import parse from 'html-react-parser';
import { Box } from '@mui/material';
import { filter, map, skip, Subject, withLatestFrom, zip } from 'rxjs';
import { AFrameElement, IBeardStyle, IButtonContent } from 'src/core/declarations/app';
import { useAppContext } from 'src/core/store';
import { modelRef } from 'src/core/declarations/enum';
// declare const AFRAME: any;

let modelButtons: any[] = []; //keep track of buttons in the 3D model for enabling/disabling on tap
declare const THREE: any;
const script8thWallDisabled = process.env.REACT_APP_8THWALL_DISABLED

const sceneGenerator = `
  <a-scene
    id='ascene' 
    xrextras-gesture-detector
    xrextras-loading
    xrextras-runtime-error
    renderer="colorManagement: true"
    xrweb>

    <a-entity light="type:directional; color:white; intensity:0.0f" position="-5 4 10"></a-entity>
 
    <a-entity id="lights">
      <a-entity light="type:directional; color:white; intensity:0.5f" position="-5 4 10"></a-entity>
      <a-entity light="type:directional; castShadow:true; color:white; intensity:0.35f" position="5 4 10"></a-entity>
    </a-entity>

    <a-camera position="0 2 2" raycaster="objects: .cantap" cursor="fuse: false; rayOrigin: mouse;"></a-camera>

    <a-assets id="assetContainer" timeout="30000">
    <a-asset-item id="model" src=""></a-asset-item>

    <span id="overlayVideoWrapper">
    
    </span>

    <span id="soundWrapper">
    
    </span>
    
      <!--box mapping reflections-->
      <img id="posx" src="imgs/HDRs/boxmap/posx.jpg">
      <img id="posy" src="imgs/HDRs/boxmap/posy.jpg">
      <img id="posz" src="imgs/HDRs/boxmap/posz.jpg">
      <img id="negx" src="imgs/HDRs/boxmap/negx.jpg">
      <img id="negy" src="imgs/HDRs/boxmap/negy.jpg">
      <img id="negz" src="imgs/HDRs/boxmap/negz.jpg">
    </a-assets>

    <a-plane height="10" width="10" rotation="-90 0 0" position="0 0 0" material="shader: shadow; opacity: 0.2" shadow></a-plane>

    <a-entity id="modelContainer" visible="true" xrextras-one-finger-rotate xrextras-pinch-scale>

      <a-entity light="type:point; color:white; intensity:0.25f" position="0 10 1"></a-entity>
    </a-entity>

    <!-- face effects -->
    <xrextras-resource id="alpha-soft-eyes" src="imgs/beards/soft-eyes.png"></xrextras-resource>

  </a-scene>
`;

interface AFrameComponentProps {
  productDataSub: Subject<string>;
  buttonListSub: Subject<IButtonContent[]>;
  beardStylesSub: Subject<IBeardStyle[]>;
  recenterEvent?: Subject<any>;
  onButtonClick?: (buttonName: string) => any;
  buttonToggleEvent?: Subject<string>;
  beardStyleEvent?: Subject<boolean>;
  switchBeardStyleEvent?: Subject<string>;
}

function DisableButtons() {
  for (const element of modelButtons) {
    element.visible = false;
  }

  document.querySelectorAll('a-box.model-button').forEach(btnBox => {
    btnBox.setAttribute('data-disabled', 'true');
  })
}

function EnableButtons() {
  document.querySelector('#modelEntity')?.setAttribute('animation-mixer', 'clip: none'); //reset animations
  for (const element of modelButtons) {
    element.visible = true;
  }

  document.querySelectorAll('a-box.model-button').forEach(btnBox => {
    btnBox.setAttribute('data-disabled', 'false');
  })
}

//#endregion AR stuffs

const AScene = memo((props: AFrameComponentProps) => {
  const {
    productDataSub,
    buttonListSub,
    recenterEvent,
    buttonToggleEvent,
    onButtonClick,
    beardStylesSub,
    beardStyleEvent,
    switchBeardStyleEvent
  } = props;

  const aframeComponent = useMemo(() => {
    return parse(sceneGenerator);
  }, []);

  const aFrameComponentRef = useRef<AFrameElement | null>(null);
  const buttonHandleEventRef = useRef(new Subject<string>());
  const { aFrameModelLoadedEvent } = useAppContext();


  useEffect(() => {
    if (!!productDataSub) {

      const subscription = productDataSub.subscribe(productLink => {
        const assetContainer = document.querySelector('#assetContainer');

        const assetItemEl = document.querySelector('a-scene a-asset-item#model');
        assetItemEl?.remove();

        const newAssetEl = document.createElement('a-asset-item');
        newAssetEl.setAttribute('id', 'model');
        newAssetEl.setAttribute('src', productLink);
        assetContainer?.insertAdjacentElement('beforebegin', newAssetEl);

        // bind entity to ascene
        const modelContainer = document.querySelector('#modelContainer');

        // reset parent scale & rotation
        modelContainer?.setAttribute('scale', "1 1 1");
        modelContainer?.setAttribute('rotation', "0 0 0");
        if (!!modelContainer) {
          modelContainer.innerHTML = '';
          const entity = document.createElement('a-entity') as AFrameElement;
          entity.setAttribute('id', 'modelEntity');
          entity.setAttribute('gltf-model', '#model');
          // FIXME debug only
          // entity.setAttribute('position', '0 0 .5');
          // entity.setAttribute('rotation', '-90 0 0');
          entity.setAttribute('scale', '5 5 5');
          entity.setAttribute('cubemap-static', '')
          entity.setAttribute('shadow', 'receive: false');
          entity.setAttribute('animation-mixer', {
            clip: 'none',
            loop: 'once',
            clampWhenFinished: 'true',
          });
          entity.setAttribute(modelRef, '');
          modelContainer?.appendChild(entity);
        }
      });

      return () => { subscription.unsubscribe(); }
    }
  }, [productDataSub]);

  useEffect(() => {
    const soundWrapper = document.querySelector('a-scene span#soundWrapper');

    const subscription = buttonListSub.subscribe((buttons) => {
      // remove audio
      const allAudios = document.querySelectorAll('a-scene span#soundWrapper audio');
      allAudios.forEach(el => el.remove());

      // load sound files
      buttons.forEach(btn => {
        if (!!btn.sound) {
          const audioEl = document.createElement('audio');
          audioEl.setAttribute('id', `btn-audio-${btn.buttonName}`);
          const audioSource = document.createElement('source');
          audioSource.setAttribute('src', btn.sound);
          audioSource.setAttribute('type', "audio/mp3");
          audioEl.appendChild(audioSource);
          soundWrapper?.appendChild(audioEl);
        }

      })
    })

    return () => { subscription.unsubscribe(); }

  }, [buttonListSub])

  useEffect(() => {

    const arModelOverlaysSub = buttonListSub.pipe(
      map(list => list.filter(b => !!b.arModelOverlay)
        .map<Pick<IButtonContent, 'buttonName' | 'arModelOverlay'>>(({ buttonName, arModelOverlay }) => ({ buttonName, arModelOverlay }))
      )
    );
    const subscription = arModelOverlaysSub.subscribe(arModelOverlays => {
      const overlayVideoWrapperEl = document.querySelector('a-scene span#overlayVideoWrapper');

      // clear previous product data

      document.querySelector('a-entity#overlayVideoMesh')?.remove();
      if (!!overlayVideoWrapperEl) overlayVideoWrapperEl.innerHTML = '';

      // append current product data
      if (!!overlayVideoWrapperEl && arModelOverlays.length > 0) {
        overlayVideoWrapperEl.innerHTML = arModelOverlays.map(({ buttonName, arModelOverlay }) => `
          <video
            id="overlayVideo${buttonName}"
            class="alpha-video"
            preload="auto"
            loop="true"
            src="${arModelOverlay}" 
            type="video/mp4"
            crossorigin="anonymous"
          >
          </video>
        `).join(' ');


        const overlayVideoMeshEl = document.createElement('a-entity') as AFrameElement;
        overlayVideoMeshEl.setAttribute('id', 'overlayVideoMesh');
        overlayVideoMeshEl.setAttribute('visible', 'false');
        overlayVideoMeshEl.setAttribute('geometry', {
          primitive: 'plane',
          height: 2,
          width: 2
        })

        overlayVideoMeshEl.setAttribute('xrextras-play-video', arModelOverlays.length > 0 ? `video: #overlayVideo${arModelOverlays[0].buttonName}` : '');
        overlayVideoMeshEl.setAttribute('material', `shader: chromakey; src: '${arModelOverlays.length > 0 ? `#overlayVideo${arModelOverlays[0].buttonName}` : ''
          }'; color: 0 0 0; side: double; depthTest: true;`)

        const sceneEl = document.querySelector('a-scene#ascene');
        if (!!sceneEl) sceneEl.insertAdjacentElement('beforeend', overlayVideoMeshEl);
      }
    });

    return () => { subscription.unsubscribe(); }

  }, [buttonListSub])

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

      document.querySelector('a-scene')?.insertAdjacentHTML('beforeend', beardStyles.map(({ id, beardImage }, beardIdx) => `
        <xrextras-resource class="beard-style-xr-resource" id="beard-${id}" src="${beardImage}"></xrextras-resource>
        <xrextras-basic-material class="beard-style-basic-material" id="paint-${id}" tex="#beard-${id}" alpha="#alpha-soft-eyes" opacity="0.9"></xrextras-basic-material>
      `).join(' '));

    })

    return () => { subscription.unsubscribe(); }

  }, [beardStylesSub])

  useEffect(() => {
    // AR buttons
    const aFrameComponent = document.querySelector('a-scene') as AFrameElement | null;

    aFrameComponentRef.current = aFrameComponent;
    if (aFrameComponent) {
      // prepare when entity is init

      const subscription =
        zip([
          aFrameModelLoadedEvent,
          buttonListSub
        ]).subscribe(([entityEl, buttonsList]) => {
          // clear old buttons
          document.querySelectorAll('a-box.model-button').forEach(btnEl => {
            btnEl.remove();
          });
          modelButtons = [];

          // add buttons of new model
          const modelMesh = entityEl.getObject3D('mesh');
          // turn off frustumCulled on meshes
          modelMesh.traverse((node: any) => {
            if (node.isMesh) {
              node.frustumCulled = false;
            }
          });


          //get list of buttons from backend and match in 3D model
          if (buttonsList && buttonsList.length > 0) {
            buttonsList.forEach((btnItem, idx) => {

              modelMesh.traverse((child: { [key: string]: any }) => {
                if (child.name.includes(btnItem.buttonName)) {
                  //add new flat material for buttons that doesn't use lighting
                  var prevMaterial = child.material;
                  child.material = new THREE.MeshBasicMaterial();
                  THREE.MeshBasicMaterial.prototype.copy.call(child.material, prevMaterial);
                  child.castShadow = false;
                  modelButtons.push(child); //add to array
                  const newEl = document.createElement('a-box') as AFrameElement;

                  newEl.setAttribute('color', 'red');
                  document.querySelector('#modelContainer')?.appendChild(newEl);
                  const target = new THREE.Vector3();
                  child.getWorldPosition(target);
                  newEl.setAttribute('position', target);
                  newEl.setAttribute('scale', { x: 0.25, y: 0.25, z: 0.25 });
                  newEl.setAttribute('transparency', true);
                  newEl.setAttribute('data-disabled', 'false');
                  newEl.setAttribute('opacity', 0);
                  newEl.setAttribute('class', 'model-button cantap');

                  newEl.setAttribute('id', 'guiButton' + btnItem.buttonName);
                  newEl.addEventListener('click', (e: unknown) => {
                    const thisBtnBox = (e as CustomEvent).target as HTMLElement;
                    const btnBoxDisabled = thisBtnBox.getAttribute('data-disabled');
                    if (btnBoxDisabled === 'true') return;

                    entityEl.setAttribute('animation-mixer', 'clip: ' + btnItem.buttonName);
                    if (btnItem.animationLooping)
                      entityEl.setAttribute("animation-mixer", "loop: true;");
                    else
                      entityEl.setAttribute("animation-mixer", "loop: once;");

                    if (btnItem.hasBeardStyles) {
                      if (beardStyleEvent) {
                        beardStyleEvent.next(true);
                      }
                    } else {
                      if (buttonClickHandle) {
                        buttonClickHandle(btnItem.buttonName);
                        // FIXME temporary if no popup content stop after x seconds
                        if (!btnItem.popupContent) {
                          setTimeout(() => {
                            buttonClickHandle("");
                          }, 8000)
                        }

                      }
                    }
                  })

                }
                if (child.name.includes('VideoPlane')) {
                  child.visible = false;
                  const pos = new THREE.Vector3();
                  child.getWorldPosition(pos);
                  var scale = new THREE.Vector3();
                  child.getWorldScale(scale);
                  document.querySelector('#overlayVideoMesh')?.setAttribute('position', pos);
                  document.querySelector('#overlayVideoMesh')?.setAttribute('scale', scale);
                  document.querySelector('#overlayVideoMesh')?.setAttribute('shadow', 'cast: false');
                }
              })
            })
          }
        })

      const buttonClickHandle = (buttonName: string) => {
        if (!!buttonName) DisableButtons();
        if (!buttonHandleEventRef.current) { console.error('something wrong') };
        if (buttonHandleEventRef.current) {
          buttonHandleEventRef.current.next(buttonName);
        }
      }

      return () => {
        subscription.unsubscribe();
      }
    }
  }, [aFrameModelLoadedEvent, beardStyleEvent, buttonListSub]);

  useEffect(() => {
    if (onButtonClick && buttonHandleEventRef.current) {
      const subscription = buttonHandleEventRef.current.subscribe((buttonName: string) => {
        // trigger content outside
        onButtonClick(buttonName);

        // play sound if any
        const buttonAudio = document.querySelector(`#btn-audio-${buttonName}`) as HTMLAudioElement;
        buttonAudio?.play();

        // TODO stop playing audio when if button content is closed
      })

      return () => { subscription.unsubscribe() }
    }
  }, [onButtonClick])

  useEffect(() => {
    // recenter event
    if (recenterEvent) {
      const aFrameComponent = aFrameComponentRef.current;

      const subscription = recenterEvent.subscribe(() => {

        if (aFrameComponent !== null && aFrameComponent !== undefined) { aFrameComponent.emit('recenter') }
        else { console.log('A-Frame scene not defined') }

      })

      return () => { subscription.unsubscribe() }
    }

  }, [recenterEvent]);

  useEffect(() => {
    if (beardStyleEvent) {
      const subscription = beardStyleEvent.pipe(
        skip(1),
        withLatestFrom(beardStylesSub),
        filter(([_, beardStyles]) => beardStyles.length > 0)
      ).subscribe(([isUsingFace, beardStyles]) => {

        const aFrameComponent = aFrameComponentRef.current;
        if (isUsingFace) {
          document.querySelector('#modelContainer')?.setAttribute('visible', 'false')
          if (!!aFrameComponent) {
            aFrameComponent.renderer.outputEncoding = THREE.LinearEncoding;
          }
          aFrameComponent?.removeAttribute('xrweb')
          aFrameComponent?.setAttribute('xrface', {
            mirroredDisplay: true,
            cameraDirection: 'front',
          })
          aFrameComponent?.insertAdjacentHTML('beforeend',
            ` 
                <xrextras-faceanchor id="face-effect">
                  <xrextras-face-mesh id="face-mesh" material-resource="#paint-${beardStyles[0].id}"></xrextras-face-mesh>
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

  useEffect(() => {
    if (switchBeardStyleEvent) {
      const subscription = switchBeardStyleEvent.subscribe(beardStyleId => {
        const aFrameComponent = aFrameComponentRef.current;
        const faceMesh = aFrameComponent?.querySelector("xrextras-face-mesh#face-mesh");
        // FIXME
        if (!!faceMesh) {
          faceMesh.setAttribute('material-resource', `#paint-${beardStyleId}`);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [switchBeardStyleEvent])

  useEffect(() => {
    const subscription = buttonHandleEventRef.current
      .pipe(
        withLatestFrom(buttonListSub)
      )
      .subscribe(([buttonName, buttonsList]) => {
        // check if a selected button should trigger model overlay effect

        const btnData = buttonsList?.find(btn => btn.buttonName === buttonName);
        const btnName = btnData?.buttonName || '';
        const arModelOverlayPlaytime = btnData?.arModelOverlayPlaytime || 0;
        const chromaColor = btnData?.arModelOverlayBgColor || '0 0 0';
        if (!!btnName) {
          const videoEl = document.querySelector(`#overlayVideo${btnName}`) as HTMLVideoElement;
          if (!!videoEl) {
            setTimeout(() => {
              try {
                videoEl.play();
                document.querySelector('#overlayVideoMesh')?.setAttribute('xrextras-play-video', `video: #overlayVideo${btnName}`);
                document.querySelector('#overlayVideoMesh')?.setAttribute('material', `shader: chromakey; src: #overlayVideo${btnName}; color: ${chromaColor}; side: double; depthTest: true;`);
                document.querySelector('#overlayVideoMesh')?.setAttribute('visible', 'true'); //disable water video
              } catch (ex) {
                console.error(ex);
              }
            }, arModelOverlayPlaytime)
          }
        }
      })

    return () => { subscription.unsubscribe(); }
  }, [buttonListSub])

  useEffect(() => {

    // TODO
    if (buttonToggleEvent) {
      const subscription = buttonToggleEvent.subscribe(buttonName => {

        if (!buttonName) {
          EnableButtons();

          // disable all overlay as well when button should be displayed since this means a specific button animation ends
          document.querySelector('#overlayVideoMesh')?.setAttribute('visible', 'false');
          const videoEls = document.querySelectorAll<HTMLVideoElement>('.alpha-video');
          videoEls.forEach((el: HTMLVideoElement) => {
            el.pause();
            el.currentTime = 0;
          });
        } else {
          const arButton = document.querySelector(`#guiButton${buttonName}`) as AFrameElement;
          if (!!arButton) arButton.click();
        }
      })

      return () => { subscription.unsubscribe(); }
    }
  }, [buttonToggleEvent])

  return (
    <>
      <Box style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: window.innerHeight,
        width: window.innerWidth
      }}>
        {script8thWallDisabled ? null : aframeComponent}
      </Box>
    </>
  )
});

const DISABLE_IMAGE_TARGETS: unknown[] = [];

export { AScene, DISABLE_IMAGE_TARGETS }
