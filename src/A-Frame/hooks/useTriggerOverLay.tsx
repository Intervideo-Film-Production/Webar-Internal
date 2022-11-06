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
				if (!!btnName) {
					const videoEl = document.querySelector(`#overlayVideo${btnName}`) as Entity<HTMLVideoElement>;
					if (!!videoEl) {
						setTimeout(() => {
							try {
								videoEl.play();

								const overlayVideoMesh = document.querySelector('#overlayVideoMesh');
								overlayVideoMesh?.removeAttribute("xrextras-play-video");
								overlayVideoMesh?.removeAttribute("material");
								overlayVideoMesh?.removeAttribute("position");
								overlayVideoMesh?.removeAttribute("geometry");
								overlayVideoMesh?.setAttribute('xrextras-play-video', `video: #overlayVideo${btnName}`);
								overlayVideoMesh?.setAttribute('material', `shader: chromakey; src: #overlayVideo${btnName}; color: ${chromaColor}; side: double; depthTest: true;`);
								overlayVideoMesh?.setAttribute("position", overlayPosition);
								overlayVideoMesh?.setAttribute('geometry', {
									primitive: 'plane',
									height: 1,
									width: 1.78
								})
								setTimeout(() => {
									overlayVideoMesh?.setAttribute('visible', 'true'); //disable water video
								}, 200);

							} catch (ex) {
								console.error(ex);
							}
						}, arModelOverlayPlaytime)
					}
					console.log(btnData?.overlayHideModel);

					if (!!btnData?.overlayHideModel) {
						const modelContainer = document.querySelector("#modelContainer");
						modelContainer?.setAttribute("visible", "false");
					}

				}
			})

		return () => { subscription.unsubscribe(); }
	}, [buttonListSub, buttonHandleEvent])
}

export default useTriggerOverLay;