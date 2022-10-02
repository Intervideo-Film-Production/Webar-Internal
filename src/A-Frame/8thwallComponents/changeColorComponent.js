// FIXME check when implementing change ar model color
export const changeColorComponent = {
    init() {
        // FIXME color buttons
        // const container = document.getElementById('container')
        // custom texture variables
        const customImg = require('./assets/candy.jpg')  // try assets/textures/space.jpg!
        const texture = new window.THREE.TextureLoader().load(customImg)
        this.offset = 0
        this.textureSelected = false
        // These hex colors are used by the UI buttons and car
        // default: white, dark blue, orange, blue, custom texture
        const colorList = ['#FFF', '#091F40', '#FF4713', '#43BBD1', 'custom-texture']
        // Named the specified mesh within the 3D model 'Car' (The mesh for the cars exterior/paint)
        const setColor = ({ newColor, button }) => {
            this.modelMesh = this.el.getObject3D('mesh').getObjectByName('Car')
            if (newColor === 'custom-texture') {
                // sets custom texture
                texture.wrapS = window.THREE.RepeatWrapping
                texture.wrapT = window.THREE.RepeatWrapping
                texture.repeat.set(8, 8)
                this.modelMesh.material.map = texture
                this.modelMesh.material.needsUpdate = true
                this.modelMesh.traverse((node) => {
                    node.material.color = new window.THREE.Color('#FFF')
                })
                this.textureSelected = true
            } else {
                // no custom texture
                this.modelMesh.material.map = null
                this.modelMesh.material.needsUpdate = true
                this.modelMesh.traverse((node) => {
                    node.material.color = new window.THREE.Color(newColor)
                })
                this.textureSelected = false
            }
            button.focus()
        }
        // create a UI button for each color in the list that changes the car color
        for (let i = 0; i < colorList.length; i++) {
            const colorButton = document.createElement('button')
            colorButton.classList.add('carousel')
            if (colorList[i] === 'custom-texture') {
                // sets button background to custom texture
                colorButton.style.backgroundImage = `url(${customImg})`
            } else {
                // sets button background to hex color
                colorButton.style.backgroundColor = colorList[i]
            }
            // FIXME
            // container.appendChild(colorButton)
            colorButton.addEventListener('click', () => setColor({
                newColor: colorList[i],
                button: colorButton,
            }))
        }
        this.el.sceneEl.addEventListener('realityready', () => {
            // Select first button in list
            // FIXME
            // const firstButton = container.getElementsByTagName('button')[0]
            // set car to first button's color
            // setColor({ newColor: colorList[0], button: firstButton })
        })
        // support horizontal scroll for more than 5 colors
        if (colorList.length > 5) {
            // FIXME
            // container.style.pointerEvents = 'auto'
        }
    },
    tick() {
        if (this.textureSelected === false) {
            return
        }
        // animates texture if selected
        this.modelMesh.getObjectByName('Car').material.map.repeat.x = 2
        this.modelMesh.getObjectByName('Car').material.map.repeat.y = 2
        this.modelMesh.getObjectByName('Car').material.map.offset.x = this.offset
        this.offset += 0.002
    },
}