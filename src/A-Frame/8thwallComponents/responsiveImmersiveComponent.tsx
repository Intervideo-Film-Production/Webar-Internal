// This component is an example of how to separate behavior by device category
import { Subject, Subscription } from "rxjs"
import { AFrameElement } from "src/core/declarations/app";

declare let XR8: any;

// using 8th Wall Engine sessionAttributes
const responsiveImmersiveComponent = (modelLoadedEvent: Subject<any>) => {
	let subscription: Subscription | null = null;
	return {
		init() {
			const onAttach = ({ sessionAttributes }: any) => {
				subscription = modelLoadedEvent.subscribe(modelEntityEl => {
					const hotspots = document.getElementById('hotspot-group')
					const s = sessionAttributes
					if (
						!s.cameraLinkedToViewer &&
						!s.controlsCamera &&
						!s.fillsCameraTexture &&
						!s.supportsHtmlEmbedded &&
						s.supportsHtmlOverlay &&
						!s.usesMediaDevices &&
						!s.usesWebXr
					) {  // Desktop-specific behavior goes here
						hotspots?.parentNode?.removeChild(hotspots)  // remove hotspots
						// const addComponents = () => {
						// 	modelEntityEl.setAttribute('change-color', '')
						// 	modelEntityEl.setAttribute('xrextras-pinch-scale', '')
						// }
						// modelEntityEl.getObject3D('mesh') ? addComponents() : modelEntityEl.addEventListener('model-loaded', addComponents)
					} else if (
						s.cameraLinkedToViewer &&
						s.controlsCamera &&
						!s.fillsCameraTexture &&
						s.supportsHtmlEmbedded &&
						!s.supportsHtmlOverlay &&
						!s.usesMediaDevices &&
						s.usesWebXr
					) {  // HMD-specific behavior goes here
						hotspots?.parentNode?.removeChild(hotspots)  // remove hotspots
						if ((this as any).el.sceneEl.xrSession.environmentBlendMode === 'opaque') {
							// VR HMD (i.e. Oculus Quest) behavior goes here
							modelEntityEl.setAttribute('ignore-raycast', '')
							// const addComponents = () => {
							// 	modelEntityEl.setAttribute('change-color', '')
							// 	modelEntityEl.setAttribute('cubemap-static', '')
							// }
							// (modelEntityEl as any).getObject3D('mesh') ? addComponents() : modelEntityEl.addEventListener('model-loaded', addComponents)
						} else if ((this as any).el.sceneEl.xrSession.environmentBlendMode === 'additive' || 'alpha-blend') {
							// AR HMD (i.e. Hololens) behavior goes here
							modelEntityEl.setAttribute('ignore-raycast', '')
							// const addComponents = () => {
							// 	modelEntityEl.setAttribute('change-color', '')
							// 	modelEntityEl.setAttribute('cubemap-static', '')
							// }
							// modelEntityEl.getObject3D('mesh') ? addComponents() : modelEntityEl.addEventListener('model-loaded', addComponents)
						}
					} else if (
						!s.cameraLinkedToViewer &&
						!s.controlsCamera &&
						s.fillsCameraTexture &&
						!s.supportsHtmlEmbedded &&
						s.supportsHtmlOverlay &&
						s.usesMediaDevices &&
						!s.usesWebXr
					) {  // Mobile-specific behavior goes here
						// FIXME color changer wrapper
						// const container = document.getElementById('container') as HTMLElement;
						// FIXME toggle absolute scale
						window.addEventListener('xrtrackingstatus', (e: any) => {
							if (e.detail.status === 'LIMITED' && e.detail.reason === 'INITIALIZING') {
								const modelContainer = (modelEntityEl as AFrameElement).parentElement as AFrameElement;
								modelContainer.object3D.scale.set(0.001, 0.001, 0.001);
								// FIXME color changer container
								// container.style.display = 'none'
							}
							if (e.detail.status === 'NORMAL') {
								// FIXME color changer container
								// container.style.display = 'block'
								const modelContainer = (modelEntityEl as AFrameElement).parentElement as AFrameElement;
								modelContainer.object3D.scale.set(1, 1, 1);
								modelContainer.setAttribute('absolute-pinch-scale', '');
							}
						})
						const addComponents = () => {
							modelEntityEl.setAttribute('change-color', '')
							modelEntityEl.setAttribute('cubemap-realtime', '')
						}
						modelEntityEl.getObject3D('mesh') ? addComponents() : modelEntityEl.addEventListener('model-loaded', addComponents)
					}
				});

			};
			const onxrloaded = () => {
				XR8.addCameraPipelineModules([{ 'name': 'responsiveImmersive', onAttach }])
			}
			XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)

		},
		remove() {
			if (!!subscription) {
				subscription.unsubscribe();
				subscription = null;
			}
		}
	}
}


export { responsiveImmersiveComponent }