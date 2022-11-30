export const absPinchScaleComponent = {
	schema: {
		min: { default: 0.1 },
		max: { default: 5 },
		scale: { default: 0 },  // If scale is set to zero here, the object's initial scale is used.
	},
	init() {
		const s = this.data.scale
		this.initialScale = (s && { x: s, y: s, z: s }) || this.el.object3D.scale.clone()
		this.scaleFactor = 1
		this.handleEvent = this.handleEvent.bind(this)
		this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
		this.el.classList.add('cantap')  // Needs "objects: .cantap" attribute on raycaster.
		// Calculate glb-model bounding box
		this.calcMeshBounds = () => {
			this.meshBounds = new window.THREE.Box3().setFromObject(this.el.object3D)
			this.lengthMeshBounds = {
				x: Math.abs(this.meshBounds.max.x - this.meshBounds.min.x),
				y: Math.abs(this.meshBounds.max.y - this.meshBounds.min.y),
				z: Math.abs(this.meshBounds.max.z - this.meshBounds.min.z),
			}
		}
		this.calcMeshBounds()
		// UI LOGIC
		this.camera = this.el.sceneEl.camera
		this.scene = new window.THREE.Scene()
		this.labelRenderer = new window.THREE.CSS2DRenderer()
		this.labelRenderer.setSize(window.innerWidth, window.innerHeight)
		console.log(this.labelRenderer.domElement);
		// this.labelRenderer.domElement.setAtribute("id", "testLabelRender");
		this.labelRenderer.domElement.style.position = 'absolute'
		this.labelRenderer.domElement.style.top = '0px'
		this.labelRenderer.domElement.style.pointerEvents = 'none'
		document.body.appendChild(this.labelRenderer.domElement)
		this.label = document.createElement('h1')
		this.label.setAttribute("id", "h1Test");
		this.label.style.color = 'white'
		this.label.style.fontFamily = '\'Nunito\', sans-serif'
		this.label.style.textShadow = 'rgb(0 0 0 / 50%) 0px 0px 6px'
		this.label.style.fontWeight = 'bold'
		document.body.appendChild(this.label)
		this.labelObj = new window.THREE.CSS2DObject(this.label)
		this.scene.add(this.labelObj)
		// TIMER LOGIC
		this.runTimer = () => {
			this.timer = window.setTimeout(
				() => {
					this.label.classList.add('fade-out')
					setTimeout(() => {
						this.label.classList.remove('fade-out')
						this.label.style.opacity = 0
					}, 250)
				}, 1000
			)
		}
	},
	tick() {
		this.labelObj.position.copy(new window.THREE.Vector3(this.el.object3D.position.x, this.lengthMeshBounds.y + 0.3, this.el.object3D.position.z))
		this.labelRenderer.render(this.scene, this.camera)
	},
	remove() {
		this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
	},
	handleEvent(event) {
		// Calculate glb-model bounding box
		this.calcMeshBounds()
		this.scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread
		this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.min), this.data.max)
		const setText = () => {
			// change % text
			const processedSF = (this.scaleFactor * 100).toFixed()
			this.label.innerText = `${processedSF}%`
		}
		if (this.scaleFactor <= 0.9 || this.scaleFactor >= 1.1) {
			// scale object
			this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
			this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
			this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z
			// change % text
			setText()
		} else if (this.scaleFactor >= 0.9 && this.scaleFactor <= 1.1) {  // snapping between 90 - 100 - 110
			this.el.object3D.scale.x = this.initialScale.x
			this.el.object3D.scale.y = this.initialScale.y
			this.el.object3D.scale.z = this.initialScale.z
			this.label.innerText = '100%'
		}
		// fade out behavior
		this.label.style.opacity = 1
		clearTimeout(this.timer)
		this.runTimer()
	},
}
