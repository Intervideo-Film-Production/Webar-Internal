
// FIXME
// for car model only
const targets = ['Front-Driver', 'Back-Driver', 'Front-Pass', 'Back-Pass']
export const proximityComponent = {
	schema: {
		target: { type: 'string', default: 'camera' },  // id of the object to check proximity on
		distance: { type: 'number', default: 3.5 },  // distance to object
	},
	init() {
		let windowsActivated
		this.activateWindows = () => {
			if (windowsActivated) {
				return
			}
			// roll down windows
			targets.forEach((target) => {
				this.el.setAttribute(`gltf-morph__${target}`, `morphtarget: ${target}; value: 1`)
				this.el.setAttribute(`animation__${target}`, `
            property: gltf-morph__${target}.value;
            from: 0;
            to: 1;
            easing: easeInOutQuad`)
			})
			windowsActivated = true
		}
		this.deactivateWindows = () => {
			if (!windowsActivated) {
				return
			}
			// roll up windows
			targets.forEach((target) => {
				this.el.setAttribute(`gltf-morph__${target}`, `morphtarget: ${target}; value: 0`)
				this.el.setAttribute(`animation__${target}`, `
            property: gltf-morph__${target}.value;
            from: 1;
            to: 0;
            easing: easeInOutQuad`)
			})
			windowsActivated = false
		}
	},
	tick() {
		const thisPosition = this.el.object3D.position
		const targetPosition = document.getElementById(this.data.target).object3D.position
		const distance = thisPosition.distanceTo(targetPosition)
		// proximity monitoring
		if (distance < this.data.distance) {
			this.activateWindows()
		} else {
			this.deactivateWindows()
		}
	},
}
