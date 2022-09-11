// This component is an example of how to separate behavior by device category
// using 8th Wall Engine sessionAttributes
const responsiveImmersiveComponent = {
	init() {
		const onAttach = ({ sessionAttributes }) => {
			const car = document.getElementById('car')
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
				hotspots.parentNode.removeChild(hotspots)  // remove hotspots
				const addComponents = () => {
					car.setAttribute('change-color', '')
					car.setAttribute('cubemap-static', '')
					car.setAttribute('xrextras-pinch-scale', '')
				}
				car.getObject3D('mesh') ? addComponents() : car.addEventListener('model-loaded', addComponents)
			} else if (
				s.cameraLinkedToViewer &&
				s.controlsCamera &&
				!s.fillsCameraTexture &&
				s.supportsHtmlEmbedded &&
				!s.supportsHtmlOverlay &&
				!s.usesMediaDevices &&
				s.usesWebXr
			) {  // HMD-specific behavior goes here
				hotspots.parentNode.removeChild(hotspots)  // remove hotspots
				if (this.el.sceneEl.xrSession.environmentBlendMode === 'opaque') {
					// VR HMD (i.e. Oculus Quest) behavior goes here
					car.setAttribute('ignore-raycast', '')
					const addComponents = () => {
						car.setAttribute('change-color', '')
						car.setAttribute('cubemap-static', '')
					}
					car.getObject3D('mesh') ? addComponents() : car.addEventListener('model-loaded', addComponents)
				} else if (this.el.sceneEl.xrSession.environmentBlendMode === 'additive' || 'alpha-blend') {
					// AR HMD (i.e. Hololens) behavior goes here
					car.setAttribute('ignore-raycast', '')
					const addComponents = () => {
						car.setAttribute('change-color', '')
						car.setAttribute('cubemap-static', '')
					}
					car.getObject3D('mesh') ? addComponents() : car.addEventListener('model-loaded', addComponents)
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
				const container = document.getElementById('container')
				window.addEventListener('xrtrackingstatus', (e) => {
					if (e.detail.status === 'LIMITED' && e.detail.reason === 'INITIALIZING') {
						car.object3D.scale.set(0.001, 0.001, 0.001)
						container.style.display = 'none'
					}
					if (e.detail.status === 'NORMAL') {
						container.style.display = 'block'
						car.object3D.scale.set(1, 1, 1)
						car.setAttribute('absolute-pinch-scale', '')
					}
				})
				const addComponents = () => {
					car.setAttribute('change-color', '')
					car.setAttribute('cubemap-realtime', '')
				}
				car.getObject3D('mesh') ? addComponents() : car.addEventListener('model-loaded', addComponents)
			}
		}
		const onxrloaded = () => {
			XR8.addCameraPipelineModules([{ 'name': 'responsiveImmersive', onAttach }])
		}
		window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
	},
}
export { responsiveImmersiveComponent }