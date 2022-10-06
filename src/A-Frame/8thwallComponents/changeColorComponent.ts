import { Subject, Subscription } from "rxjs";
import { IProductColor } from "src/core/declarations/app";
import { Component } from 'aframe';
import { ProductColorTypes } from "src/core/declarations/enum";



// check actual types for three, temporary manually extending Object3D class
interface ExtendedObject3D extends THREE.Object3D<THREE.Event> {
    material?: any;
}

// FIXME check when implementing change ar model color
interface ColorComponent extends Partial<Component> {
    offset?: number;
    textureSelected?: boolean;
    modelMesh?: ExtendedObject3D;
    subscription?: Subscription;
}

interface IChangeColorComponentGenerator {
    (productColorEvent: Subject<IProductColor>): ColorComponent;
}

export const changeColorComponent: IChangeColorComponentGenerator = (productColorEvent: Subject<IProductColor>) => ({
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
        // const colorList = ['#FFF', '#091F40', '#FF4713', '#43BBD1', 'custom-texture']
        // Named the specified mesh within the 3D model 'Car' (The mesh for the cars exterior/paint)
        // FIXME
        // const setColor = ({ newColor, button }) => {
        const setColor = (newColor: IProductColor) => {
            this.modelMesh = this.el?.getObject3D('mesh').getObjectByName('Car');
            if (newColor.type === ProductColorTypes.pattern) {
                if (!this.modelMesh) return;
                // sets custom texture
                texture.wrapS = window.THREE.RepeatWrapping
                texture.wrapT = window.THREE.RepeatWrapping
                texture.repeat.set(8, 8)
                this.modelMesh.material.map = texture
                this.modelMesh.material.needsUpdate = true
                this.modelMesh?.traverse((node: ExtendedObject3D) => {
                    node.material.color = new window.THREE.Color('#FFF')
                })
                this.textureSelected = true
            } else {
                // no custom texture
                if (!this.modelMesh) return;

                this.modelMesh.material.map = null
                this.modelMesh.material.needsUpdate = true
                this.modelMesh.traverse((node: ExtendedObject3D) => {
                    node.material.color = new window.THREE.Color(newColor.value)
                })
                this.textureSelected = false
            }
          
        }

        this.subscription = productColorEvent.subscribe((newColor: IProductColor) => {
            setColor(newColor);
        });

        // support horizontal scroll for more than 5 colors
        // FIXME
        // if (colorList.length > 5) {
        //     // FIXME
        //     // container.style.pointerEvents = 'auto'
        // }
    },
    tick() {
        if (this.textureSelected === false) {
            return
        }
        // animates texture if selected
        const carObject = this.modelMesh?.getObjectByName('Car') as ExtendedObject3D;
        if (!carObject) return;
        carObject.material.map.repeat.x = 2
        carObject.material.map.repeat.y = 2
        carObject.material.map.offset.x = this.offset
        if (!!this.offset) this.offset += 0.002
    },
})