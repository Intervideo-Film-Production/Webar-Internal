import { Entity } from "aframe";
import { useEffect } from "react";
import { Subject, withLatestFrom } from "rxjs";
import { IButtonContent } from "src/core/declarations/app";

const useTriggerOverLay = (buttonListSub: Subject<IButtonContent[]>, buttonHandleEvent: Subject<string>) => {
	useEffect(() => {
		const subscription = buttonHandleEvent
			.pipe(
				withLatestFrom(buttonListSub)
			)
			.subscribe(([buttonName, buttonsList]) => {
				// check if a selected button should trigger model overlay effect
				const btnData = buttonsList?.find(btn => btn.buttonName === buttonName);
				const btnName = btnData?.buttonName || '';
				const arModelOverlayPlaytime = btnData?.arModelOverlayPlaytime || 0;
				const chromaColor = btnData?.arModelOverlayBgColor || '0 0 0';
				const overlayPosition = btnData?.arOverlayPosition || '0 0 0';
        const overlayScale = btnData?.arOverlayScale || '1 1 1';

				if (!!btnName) {
					const videoEl = document.querySelector(`#overlayVideo${btnName}`) as Entity<HTMLVideoElement>;
					if (!!videoEl) {
						setTimeout(() => {
							try {
								videoEl.play();

								const alphaVideoMesh = document.querySelector('#alphaVideoMesh');
								alphaVideoMesh?.removeAttribute("play-video");
								alphaVideoMesh?.removeAttribute("material");
								alphaVideoMesh?.removeAttribute("position");
								alphaVideoMesh?.removeAttribute("scale");
								alphaVideoMesh?.setAttribute('play-video', `video: #overlayVideo${btnName}`);
								alphaVideoMesh?.setAttribute('material', `shader: chromakey; src: #overlayVideo${btnName}; color: ${chromaColor}; side: double; depthTest: true;`);
								alphaVideoMesh?.setAttribute("position", overlayPosition);
                alphaVideoMesh?.setAttribute("scale", overlayScale);
								alphaVideoMesh?.setAttribute('geometry', {
									primitive: 'plane',
									height: 1,
									width: 1.78
								})
								setTimeout(() => {
									alphaVideoMesh?.setAttribute('visible', 'true'); //disable water video
								}, 350);

							} catch (ex) {
								console.error(ex);
							}
						}, arModelOverlayPlaytime)
					}

					if (!!btnData?.overlayHideModel) {
						const modelContainer = document.querySelector("#modelContainer");
            modelContainer?.removeAttribute("xrextras-one-finger-rotate");
            modelContainer?.removeAttribute("xrextras-pinch-scale");
            modelContainer?.setAttribute("visible", "false");
					}

				}
			})

		return () => { subscription.unsubscribe(); }
	}, [buttonListSub, buttonHandleEvent])
}

export default useTriggerOverLay;