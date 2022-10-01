import { useEffect } from "react";
import { Subject, map } from "rxjs";
import { IButtonContent, AFrameElement } from "src/core/declarations/app";

const useInsertButtonOverlays = (buttonListSub: Subject<IButtonContent[]>) => {
	useEffect(() => {
		const arModelOverlaysSub = buttonListSub.pipe(
			map(list => list.filter(b => !!b.arModelOverlay)
				.map<Pick<IButtonContent, 'buttonName' | 'arModelOverlay'>>(({ buttonName, arModelOverlay }) => ({ buttonName, arModelOverlay }))
			)
		);

		const subscription = arModelOverlaysSub.subscribe(arModelOverlays => {
			const overlayVideoWrapperEl = document.querySelector('a-scene span#overlayVideoWrapper');

			// clear previous product data

			document.querySelector('a-entity#overlayVideoMesh')?.remove();
			if (!!overlayVideoWrapperEl) overlayVideoWrapperEl.innerHTML = '';

			// append current product data
			if (!!overlayVideoWrapperEl && arModelOverlays.length > 0) {
				overlayVideoWrapperEl.innerHTML = arModelOverlays.map(({ buttonName, arModelOverlay }) => `
				<video
					id="overlayVideo${buttonName}"
					class="alpha-video"
					preload="auto"
					loop="true"
					src="${arModelOverlay}" 
					type="video/mp4"
					crossorigin="anonymous"
				>
				</video>
				`).join(' ');

				const overlayVideoMeshEl = `<a-entity 
					id="overlayVideoMesh" 
					visible="false" 
					geometry="primitive:plane; height: 2; width: 2;"
					xrextras-play-video="${arModelOverlays.length > 0 ? `video: #overlayVideo${arModelOverlays[0].buttonName}` : ''}"
					material="shader: chromakey;
						src: ${arModelOverlays.length > 0 ? `#overlayVideo${arModelOverlays[0].buttonName}` : ''};
						color: 0 0 0; 
						side: double; 
						depthTest: true;"
					></a-entity>`

				// NOTE back up
				// const overlayVideoMeshEl = document.createElement('a-entity') as AFrameElement;
				// overlayVideoMeshEl.setAttribute('id', 'overlayVideoMesh');
				// overlayVideoMeshEl.setAttribute('visible', 'false');
				// overlayVideoMeshEl.setAttribute('geometry', {
				// 	primitive: 'plane',
				// 	height: 2,
				// 	width: 2
				// })

				// overlayVideoMeshEl.setAttribute('xrextras-play-video', arModelOverlays.length > 0 ? `video: #overlayVideo${arModelOverlays[0].buttonName}` : '');
				// overlayVideoMeshEl.setAttribute('material', `shader: chromakey; src: '${arModelOverlays.length > 0 ? `#overlayVideo${arModelOverlays[0].buttonName}` : ''
				// 	}'; color: 0 0 0; side: double; depthTest: true;`)

				const sceneEl = document.querySelector('a-scene#ascene');
				if (!!sceneEl) sceneEl.insertAdjacentHTML('beforeend', overlayVideoMeshEl);
			}
		});

		return () => { subscription.unsubscribe(); }
	}, [buttonListSub])
}

export default useInsertButtonOverlays;
