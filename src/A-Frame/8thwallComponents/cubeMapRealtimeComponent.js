const ensureMaterialArray = (material) => {
	if (!material) {
		return []
	}
	if (Array.isArray(material)) {
		return material
	}
	if (material.materials) {
		return material.materials
	}
	return [material]
}
const applyEnvMap = (mesh, envMap) => {
	if (!mesh) return
	mesh.traverse((node) => {
		if (!node.isMesh) {
			return
		}
		const meshMaterials = ensureMaterialArray(node.material)
		meshMaterials.forEach((material) => {
			if (material && !('envMap' in material)) return
			material.envMap = envMap
			material.needsUpdate = true
		})
	})
}
const cubeMapRealtimeComponent = {
	schema: {},
	init() {
		const { data } = this
		const scene = this.el.sceneEl
		const camTexture_ = new window.THREE.Texture()
		const refMat = new window.THREE.MeshBasicMaterial({
			side: window.THREE.DoubleSide,
			color: 0xffffff,
			map: camTexture_,
		})
		const renderTarget = new window.THREE.WebGLCubeRenderTarget(256, {
			format: window.THREE.RGBFormat,
			generateMipmaps: true,
			minFilter: window.THREE.LinearMipmapLinearFilter,
			encoding: window.THREE.sRGBEncoding,
		})
		// cubemap scene
		const cubeMapScene = new window.THREE.Scene()
		const cubeCamera = new window.THREE.CubeCamera(1, 1000, renderTarget)
		const sphere = new window.THREE.SphereGeometry(100, 15, 15)
		const sphereMesh = new window.THREE.Mesh(sphere, refMat)
		sphereMesh.scale.set(-1, 1, 1)
		sphereMesh.rotation.set(Math.PI, -Math.PI / 2, 0)
		cubeMapScene.add(sphereMesh)
		window.XR8.XrController.configure({ enableLighting: true })
		window.XR8.addCameraPipelineModule({
			name: 'cubemap-process',
			onUpdate: () => {
				cubeCamera.update(scene.renderer, cubeMapScene)
			},
			onProcessCpu: ({ frameStartResult }) => {
				const { cameraTexture } = frameStartResult
				// force initialization
				const texProps = scene.renderer.properties.get(camTexture_)
				texProps.__webglTexture = cameraTexture
			},
		})
		const mesh = this.el.getObject3D('mesh')
		mesh ? applyEnvMap(this.el.getObject3D('mesh'), cubeCamera.renderTarget.texture) : window.addEventListener('model-loaded', applyEnvMap(this.el.getObject3D('mesh'), cubeCamera.renderTarget.texture))
	},
}
export { cubeMapRealtimeComponent }
