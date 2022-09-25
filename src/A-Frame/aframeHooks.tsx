import { useEffect } from "react"
import { map, Subject, withLatestFrom, zip } from "rxjs";
import { AFrameElement, IButtonContent, IProduct } from "src/core/declarations/app";
import { modelRef } from "src/core/declarations/enum";
import { useAppContext } from "src/core/store";

declare const THREE: any;

let modelButtons: any[] = []; //keep track of buttons in the 3D model for enabling/disabling on tap

function disableButtons() {
	for (const element of modelButtons) {
		element.visible = false;
	}

	document.querySelectorAll('a-box.model-button').forEach(btnBox => {
		btnBox.setAttribute('data-disabled', 'true');
	})
}

function enableButtons() {
	document.querySelector('#modelEntity')?.setAttribute('animation-mixer', 'clip: none'); //reset animations
	for (const element of modelButtons) {
		element.visible = true;
	}

	document.querySelectorAll('a-box.model-button').forEach(btnBox => {
		btnBox.setAttribute('data-disabled', 'false');
	})
}

// to fix rendering issue on iOS
export const useMaxTouchPoints = () => {
	useEffect(() => {
		const IS_IOS =
			/^(iPad|iPhone|iPod)/.test(window.navigator.userAgent) ||
			(/^Mac/.test(window.navigator.userAgent) && window.navigator.maxTouchPoints > 1)
		if (IS_IOS) {
			(window.createImageBitmap as any) = undefined
		}
	}, [])
}

export const useInsertModel = (modelLinkSub: Subject<Partial<IProduct>>) => {
	useEffect(() => {

		const subscription = modelLinkSub.subscribe(({ arObjectUrl, cubemap }) => {
			const assetContainer = document.querySelector('#assetContainer');

			// load asset
			const assetItemEl = document.querySelector('a-scene a-asset-item#model');
			assetItemEl?.remove();

			const newAssetEl = document.createElement('a-asset-item');
			newAssetEl.setAttribute('id', 'model');
			newAssetEl.setAttribute('src', arObjectUrl || "");
			assetContainer?.insertAdjacentElement('afterbegin', newAssetEl);

			// cubemap
			if (cubemap && Object.values(cubemap).filter(v => !!v).length === 6) {
				Object.keys(cubemap).forEach((key) => {

					const cubemapImg = document.createElement("img");
					cubemapImg.setAttribute("id", key);
					cubemapImg.setAttribute("crossorigin", "anonymous");
					cubemapImg.setAttribute("src", cubemap[key as keyof IProduct["cubemap"]]);

					assetContainer?.insertAdjacentElement('beforeend', cubemapImg);
				})
			}

			// bind entity to ascene
			const modelContainer = document.querySelector('#modelContainer');
			// reset parent scale & rotation
			// modelContainer?.setAttribute('scale', "1 1 1");
			// modelContainer?.setAttribute('rotation', "0 0 0");
			if (!!modelContainer) {
				modelContainer.innerHTML = '';
				const entity = document.createElement('a-entity') as AFrameElement;
				entity.setAttribute('id', 'modelEntity');
				entity.setAttribute('gltf-model', '#model');
				// FIXME debug only
				// entity.setAttribute('position', '0 0 .5');
				// entity.setAttribute('rotation', '-90 0 0');
				// entity.setAttribute('scale', '5 5 5');
				entity.setAttribute('xrextras-hold-drag', 'rise-height: 0');
				entity.setAttribute('xrextras-two-finger-rotate', '');
				entity.setAttribute('cubemap-static', '')
				// FIXME absolute scale proximity settings
				entity.setAttribute('proximity', '');
				// FIXME change model color feature
				// entity.setAttribute('change-color', '')
				entity.setAttribute('shadow', 'receive: false');
				entity.setAttribute('animation-mixer', {
					clip: 'none',
					loop: 'once',
					clampWhenFinished: 'true',
				});
				entity.setAttribute(modelRef, '');
				modelContainer?.appendChild(entity);
			}
		})

		return () => { subscription.unsubscribe(); }
	}, [modelLinkSub])
}

export const useInsertButtonOverlays = (buttonListSub: Subject<IButtonContent[]>) => {
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
}

export const useInsertButtonSound = (buttonListSub: Subject<IButtonContent[]>) => {
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
}

export const useInsertButtons = (
	buttonListSub: Subject<IButtonContent[]>,
	buttonHandleEvent: Subject<string>) => {
	const { aFrameModelLoadedEvent } = useAppContext();

	useEffect(() => {
		// AR buttons
		const aFrameComponent = document.querySelector('a-scene') as AFrameElement | null;

		const buttonClickHandle = (buttonName: string) => {
			if (!!buttonName) disableButtons();
			if (!buttonHandleEvent) { console.error('something wrong') };
			if (buttonHandleEvent) {
				buttonHandleEvent.next(buttonName);
			}
		}

		// aFrameComponentRef.current = aFrameComponent;
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
									var box = new THREE.Box3().setFromObject(child);
									const boxMin = box.min;
									const boxMax = box.max;
									const meshX = boxMax.x - boxMin.x,
										meshY = boxMax.y - boxMin.y,
										meshZ = boxMax.z - boxMin.z;

									// const testSize = child.getSize();
									child.getWorldPosition(target);
									newEl.setAttribute('position', target);
									// check sizes of other models buttons
									newEl.setAttribute('scale', { x: meshX, y: meshY, z: meshZ });
									newEl.setAttribute('transparency', true);
									newEl.setAttribute('data-disabled', 'false');
									newEl.setAttribute('opacity', 1);
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

										// temporary ignore beardstyle
										// if (btnItem.hasBeardStyles) {
										//   if (beardStyleEvent) {
										//     beardStyleEvent.next(true);
										//   }
										// } else {

										if (buttonClickHandle) {
											buttonClickHandle(btnItem.buttonName);
											// FIXME temporary if no popup content stop after x seconds
											if (!btnItem.popupContent) {
												setTimeout(() => {
													buttonClickHandle("");
												}, 8000)
											}
											// }

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

			return () => {
				subscription.unsubscribe();
			}
		}
	}, [aFrameModelLoadedEvent, buttonListSub, buttonHandleEvent]);

}

export const useTriggerOverLay = (buttonListSub: Subject<IButtonContent[]>, buttonHandleEvent: Subject<string>) => {
	useEffect(() => {
		const subscription = buttonHandleEvent
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
	}, [buttonListSub, buttonHandleEvent])
}

export const useTriggerExternalEffectAndSound = (onButtonClick: (buttonName: string) => any, buttonHandleEvent: Subject<string>) => {
	useEffect(() => {
		if (onButtonClick && buttonHandleEvent) {
			const subscription = buttonHandleEvent.subscribe((buttonName: string) => {
				// trigger content outside
				onButtonClick(buttonName);

				// play sound if any
				const buttonAudio = document.querySelector(`#btn-audio-${buttonName}`) as HTMLAudioElement;
				buttonAudio?.play();

				// TODO stop playing audio when if button content is closed
			})

			return () => { subscription.unsubscribe() }
		}
	}, [onButtonClick, buttonHandleEvent])
}

export const useEnableButtonsFromExternalEvent = (buttonToggleEvent?: Subject<string>) => {
	useEffect(() => {

		// TODO
		if (buttonToggleEvent) {
			const subscription = buttonToggleEvent.subscribe(buttonName => {

				if (!buttonName) {
					enableButtons();

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
}

export const useWatchRecenterEvent = (recenterEvent?: Subject<any>) => {
	useEffect(() => {
		// recenter event
		if (recenterEvent) {
			const aFrameComponent = document.querySelector('a-scene') as AFrameElement | null;

			const subscription = recenterEvent.subscribe(() => {

				if (aFrameComponent !== null && aFrameComponent !== undefined) { aFrameComponent.emit('recenter') }
				else { console.log('A-Frame scene not defined') }

			})

			return () => { subscription.unsubscribe() }
		}

	}, [recenterEvent]);
}