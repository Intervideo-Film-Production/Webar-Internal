import { memo } from "react";


interface IFaceEffectSceneProps {
    // productDataSub: Subject<Partial<IProduct>>;
    // buttonListSub: Subject<IButtonContent[]>;
    // beardStylesSub: Subject<IBeardStyle[]>;
    // recenterEvent?: Subject<any>;
    // onButtonClick?: (buttonName: string) => any;
    // buttonToggleEvent?: Subject<string>;
    // beardStyleEvent?: Subject<boolean>;
    // switchBeardStyleEvent?: Subject<string>;
}



// FIXME should in face effect
// useEffect(() => {
//   if (switchBeardStyleEvent) {
//     const subscription = switchBeardStyleEvent.subscribe(beardStyleId => {
//       const aFrameComponent = aFrameComponentRef.current;
//       const faceMesh = aFrameComponent?.querySelector("xrextras-face-mesh#face-mesh");
//       // FIXME
//       if (!!faceMesh) {
//         faceMesh.setAttribute('material-resource', `#paint-${beardStyleId}`);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }
// }, [switchBeardStyleEvent])

// FIXME should be in face effect
// useEffect(() => {
//   // beard styles
//   const subscription = beardStylesSub.subscribe(beardStyles => {
//     // remove previous beard styles
//     document.querySelectorAll('xrextras-resource.beard-style-xr-resource').forEach(el => {
//       el.remove();
//     })

//     document.querySelectorAll('xrextras-basic-material.beard-style-basic-material').forEach(el => {
//       el.remove();
//     })

//     document.querySelector('a-scene')?.insertAdjacentHTML('beforeend', beardStyles.map(({ id, beardImage }, beardIdx) => `
//       <xrextras-resource class="beard-style-xr-resource" id="beard-${id}" src="${beardImage}"></xrextras-resource>
//       <xrextras-basic-material class="beard-style-basic-material" id="paint-${id}" tex="#beard-${id}" alpha="#alpha-soft-eyes" opacity="0.9"></xrextras-basic-material>
//     `).join(' '));

//   })

//   return () => { subscription.unsubscribe(); }

// }, [beardStylesSub])

// FIXME shold separate between beard style and webar
// useEffect(() => {
//   if (beardStyleEvent) {
//     const subscription = beardStyleEvent.pipe(
//       skip(1),
//       withLatestFrom(beardStylesSub),
//       filter(([_, beardStyles]) => beardStyles.length > 0)
//     ).subscribe(([isUsingFace, beardStyles]) => {

//       const aFrameComponent = aFrameComponentRef.current;
//       if (isUsingFace) {
//         document.querySelector('#modelContainer')?.setAttribute('visible', 'false')
//         if (!!aFrameComponent) {
//           aFrameComponent.renderer.outputEncoding = THREE.LinearEncoding;
//         }
//         aFrameComponent?.removeAttribute('xrweb')
//         aFrameComponent?.setAttribute('xrface', {
//           mirroredDisplay: true,
//           cameraDirection: 'front',
//         })
//         aFrameComponent?.insertAdjacentHTML('beforeend',
//           ` 
//               <xrextras-faceanchor id="face-effect">
//                 <xrextras-face-mesh id="face-mesh" material-resource="#paint-${beardStyles[0].id}"></xrextras-face-mesh>
//               </xrextras-faceanchor>

//               <xrextras-capture-button capture-mode="photo"></xrextras-capture-button>

//               <!-- configure capture settings -->
//               <xrextras-capture-config
//                 file-name-prefix="braun-image-"
//                 request-mic="manual"
//               ></xrextras-capture-config>

//               <!-- add capture preview -->
//               <xrextras-capture-preview></xrextras-capture-preview>

//           `);


//         // add camera button else where
//         setTimeout(() => {
//           const beardInteractionARea = document.querySelector('#beard-content-drawer');
//           if (!!beardInteractionARea) {
//             const offsetBottom = beardInteractionARea.getBoundingClientRect().height;
//             const recorderButton = document.querySelector('#recorder.recorder-container');
//             if (!!recorderButton) {
//               recorderButton.setAttribute('style', `bottom: ${offsetBottom + 20}px !important;z-index: 3000;`);
//             }
//           }
//         }, 50)
//       }
//       else {
//         document.querySelector('#modelContainer')?.setAttribute('visible', 'true')
//         if (!!aFrameComponent) {
//           aFrameComponent.renderer.outputEncoding = THREE.sRGBEncoding;
//         }
//         const faceAnchor = document.querySelector('xrextras-faceanchor')
//         faceAnchor?.parentNode?.removeChild(faceAnchor)
//         aFrameComponent?.removeAttribute('xrface')
//         aFrameComponent?.setAttribute('xrweb', '')

//         //remove screenshot button
//         const captureButton = document.querySelector('xrextras-capture-button');
//         captureButton?.parentNode?.removeChild(captureButton);
//         const captureButtonConfig = document.querySelector('xrextras-capture-config');
//         captureButtonConfig?.parentNode?.removeChild(captureButtonConfig);
//         const captureButtonPrev = document.querySelector('xrextras-capture-preview');
//         captureButtonPrev?.parentNode?.removeChild(captureButtonPrev);

//       }

//     });

//     return () => subscription.unsubscribe();

//   }
// }, [beardStyleEvent, beardStylesSub])



const FaceEffaceScene: React.FC<IFaceEffectSceneProps> = memo(() => {
    return (<></>)
})