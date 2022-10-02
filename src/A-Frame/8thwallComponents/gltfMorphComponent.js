
// FIXME checking if need adjustment
export const gltfMorphComponent = {
	multiple: true,
	schema: {
		morphtarget: { type: 'string', default: '' },
		value: { type: 'number', default: 0 },
	},
	init() {
		this.el.addEventListener('object3dset', () => {
			this.morpher()
		})
	},
	update() {
		this.morpher()
	},
	morpher() {
		const mesh = this.el.object3D
		mesh.traverse((o) => {
			if (o.morphTargetInfluences && o.userData.targetNames) {
				const pos = o.userData.targetNames.indexOf(this.data.morphtarget)
				o.morphTargetInfluences[pos] = this.data.value
			}
		})
	},
}