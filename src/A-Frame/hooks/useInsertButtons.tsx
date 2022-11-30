import { Entity } from "aframe";
import { useEffect } from "react"
import { Subject, zip } from "rxjs";
import { AFrameElement, IButtonContent } from "src/core/declarations/app";
import { useAppContext } from "src/core/events";

declare const THREE: any;

let modelButtons: any[] = []; //keep track of buttons in the 3D model for enabling/disabling on tap

export function disableButtons() {
	for (const element of modelButtons) {
		element.visible = false;
	}

	document.querySelectorAll('a-box.model-button').forEach(btnBox => {
		btnBox.setAttribute('data-disabled', 'true');
	})
}

export function enableButtons() {
	document.querySelector('#modelEntity')?.setAttribute('animation-mixer', 'clip: none'); //reset animations
	for (const element of modelButtons) {
		element.visible = true;
	}

	document.querySelectorAll('a-box.model-button').forEach(btnBox => {
		btnBox.setAttribute('data-disabled', 'false');
	})
}

export const useInsertButtons = (
	buttonListSub: Subject<IButtonContent[]>,
	buttonHandleEvent: Subject<string>) => {
	const { aFrameModelLoadedEvent } = useAppContext();

	useEffect(() => {
		// AR buttons
		const aFrameComponent = document.querySelector('a-scene');
		// const aFrameComponent = document.querySelector('a-scene') as AFrameElement | null;

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

							// FIXME setTimeout is temporary as the aframe buttons load quicker than the 3d object
							// need checking the model loads event or put some delay else where 
							setTimeout(() => {
								modelMesh.traverse((child: { [key: string]: any }) => {
									if (child.name.includes(btnItem.buttonName)) {
										//add new flat material for buttons that doesn't use lighting
										var prevMaterial = child.material;
										child.material = new THREE.MeshBasicMaterial();
										THREE.MeshBasicMaterial.prototype.copy.call(child.material, prevMaterial);
										child.castShadow = false;
										modelButtons.push(child); //add to array

										const newEl = document.createElement('a-box');

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
										console.log(btnItem.buttonName, { x: meshX, y: meshY, z: meshZ });
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
							}, 500)


						})
					}
				})

			return () => {
				subscription.unsubscribe();
			}
		}
	}, [aFrameModelLoadedEvent, buttonListSub, buttonHandleEvent]);

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
					// display ar model if hidden before
					const modelContainer = document.querySelector("#modelContainer");
					modelContainer?.setAttribute("visible", "true");

					const videoEls = document.querySelectorAll('.alpha-video') as NodeListOf<HTMLVideoElement>;
					videoEls.forEach((el: HTMLVideoElement) => {
						el.pause();
						el.currentTime = 0;
					});
				} else {
					const arButton = document.querySelector(`#guiButton${buttonName}`) as Entity;
					// const arButton = document.querySelector(`#guiButton${buttonName}`) as AFrameElement;
					if (!!arButton) arButton.click();
				}
			})

			return () => { subscription.unsubscribe(); }
		}
	}, [buttonToggleEvent])
}
