// A React component for 8th Wall AFrame scenes. The scene HTML can be supplied, along with
// any components or primitives that should be registered, and any image targets that should be
// loaded if something other than the automatically loaded set is wanted. Passing
// DISABLE_IMAGE_TARGETS will prevent any image targets from loading, including ones that would
// otherwise enabled automatically.
// Helper function to make sure that aframe components are only registered once, since they can't
// be cleanly unregistered.
import React, { memo, useEffect } from 'react'
declare const AFRAME: any;
declare const XR8: any;
export interface AframeComponent {
    name: string;
    // FIXME any
    val: any;
}

const registeredComponents = new Set();
const registerComponents = (components: Array<AframeComponent>) => components.forEach(({ name, val }) => {
    if (registeredComponents.has(name)) {
        return
    }
    registeredComponents.add(name)
    AFRAME.registerComponent(name, val)
})
// Helper function to make sure that aframe systems are only registered once, since they can't
// be cleanly unregistered.

interface AframeSystem {
    name: string;
    // FIXME
    val: any;
}
const registeredSystems = new Set();
const registerSystems = (systems: Array<AframeSystem>) => systems.forEach(({ name, val }) => {
    if (registeredSystems.has(name)) {
        return
    }
    registeredSystems.add(name)
    AFRAME.registerSystem(name, val)
})
// Helper function to make sure that aframe primitives are only registered once, since they can't
// be cleanly unregistered.


interface AframePrimitive {
    name: string;
    // FIXME
    val: any;
}
const registeredPrimitives = new Set()
const registerPrimitives = (primitives: Array<AframePrimitive>) => primitives.forEach(({ name, val }) => {
    if (registeredPrimitives.has(name)) {
        return
    }
    registeredPrimitives.add(name)
    AFRAME.registerPrimitive(name, val)
})

// A react component for loading and unloading an aframe scene. The initial scene contents should
// be specified as an html string in sceneHtml. All props must be specified when the component
// mounts. Updates to props will be ignored.
//
// Optionally, aframe coponents to register for this scene can be passed as [{name, val}] arrays.
// Care is needed here to not define the same component different across scenes, since aframe
// components can't be unloaded.
//
// Optionally imageTargets can be specified to override the set loaded by default.
interface IAframeSceneProps {
    sceneHtml: string;
    // FIXME
    imageTargets?: any;
    components?: Array<AframeComponent>;
    systems?: Array<AframeSystem>;
    primitives?: Array<AframePrimitive>;
}

const AFrameScene: React.FC<IAframeSceneProps> = memo(({ sceneHtml, imageTargets, components, systems, primitives }) => {
    useEffect(() => {
        if (imageTargets) {
            XR8.XrController.configure({ imageTargets })
        }
        if (components) {
            registerComponents(components)
        }
        if (systems) {
            registerSystems(systems)
        }
        if (primitives) {
            registerPrimitives(primitives)
        }
        const html = document.getElementsByTagName('html')[0]
        const origHtmlClass = html.className;
        document.body.insertAdjacentHTML('beforeend', sceneHtml);

        // Cleanup
        return () => {
            const ascene = document.getElementsByTagName('a-scene')[0] as Element;
            ascene?.parentNode?.removeChild(ascene)
            html.className = origHtmlClass
        }
        // eslint-disable-next-line
    }, [])

    return null
})
const DISABLE_IMAGE_TARGETS: Array<any> = []
export { AFrameScene, DISABLE_IMAGE_TARGETS }