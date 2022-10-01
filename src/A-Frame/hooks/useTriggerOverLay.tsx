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
				if (!!btnName) {
					const videoEl = document.querySelector(`#overlayVideo${btnName}`) as HTMLVideoElement;
					if (!!videoEl) {
						setTimeout(() => {
							try {
								videoEl.play();
								document.querySelector('#overlayVideoMesh')?.setAttribute('xrextras-play-video', `video: #overlayVideo${btnName}`);
								document.querySelector('#overlayVideoMesh')?.setAttribute('material', `shader: chromakey; src: #overlayVideo${btnName}; color: ${chromaColor}; side: double; depthTest: true;`);
								document.querySelector('#overlayVideoMesh')?.setAttribute('visible', 'true'); //disable water video
							} catch (ex) {
								console.error(ex);
							}
						}, arModelOverlayPlaytime)
					}
				}
			})

		return () => { subscription.unsubscribe(); }
	}, [buttonListSub, buttonHandleEvent])
}

export default useTriggerOverLay;