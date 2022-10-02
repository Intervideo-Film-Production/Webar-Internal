// FIXME checking if need adjustment
const shortCircutRaycast = (obj3d) => {
	obj3d.traverse((node) => {
		node.raycast = () => { }
	})
}

// FIXME checking if need adjustment
export const ignoreRaycast = {
	init() {
		const { object3D } = this.el
		const clearRaycast = (e) => {
			shortCircutRaycast(object3D)
			this.el.removeEventListener(e.type, clearRaycast)
		}
		if (this.el.getObject3D('mesh')) {
			clearRaycast('loaded')
		}
		this.el.addEventListener('model-loaded', clearRaycast)
		this.el.addEventListener('loaded', clearRaycast)
		this.el.addEventListener('child-attached', clearRaycast)
	},
}
