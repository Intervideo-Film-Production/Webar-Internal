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

			document.querySelector('a-entity#alphaVideoMesh')?.remove();
			if (!!overlayVideoWrapperEl) overlayVideoWrapperEl.innerHTML = '';

			// append current product data
			if (!!overlayVideoWrapperEl && arModelOverlays.length > 0) {
				overlayVideoWrapperEl.innerHTML = arModelOverlays.map(({ buttonName, arModelOverlay }) => `
				<video
					playsinline
					id="overlayVideo${buttonName}"
					class="alpha-video"
					preload="auto"
					src="${arModelOverlay}" 
					type="video/mp4"
					crossorigin="anonymous"
				>
				</video>
				`).join(' ');

				// TODO need calculate video ratio
				const alphaVideoMeshEl = `<a-entity 
					id="alphaVideoMesh" 
					visible="false" 
					></a-entity>`

				// NOTE back up
				// const alphaVideoMeshEl = document.createElement('a-entity') as AFrameElement;
				// alphaVideoMeshEl.setAttribute('id', 'alphaVideoMesh');
				// alphaVideoMeshEl.setAttribute('visible', 'false');
				// alphaVideoMeshEl.setAttribute('geometry', {
				// 	primitive: 'plane',
				// 	height: 2,
				// 	width: 2
				// })

				// alphaVideoMeshEl.setAttribute('xrextras-play-video', arModelOverlays.length > 0 ? `video: #overlayVideo${arModelOverlays[0].buttonName}` : '');
				// alphaVideoMeshEl.setAttribute('material', `shader: chromakey; src: '${arModelOverlays.length > 0 ? `#overlayVideo${arModelOverlays[0].buttonName}` : ''
				// 	}'; color: 0 0 0; side: double; depthTest: true;`)

				const sceneEl = document.querySelector('a-scene#ascene');
				if (!!sceneEl) sceneEl.insertAdjacentHTML('beforeend', alphaVideoMeshEl);
			}
		});

		return () => { subscription.unsubscribe(); }
	}, [buttonListSub])
}

export default useInsertButtonOverlays;
