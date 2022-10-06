import { Scene } from "aframe";
import { useEffect } from "react";
import { Subject } from "rxjs";
import { IProduct, AFrameElement } from "src/core/declarations/app";
import { modelRef } from "src/core/declarations/enum";

const useInsertModel = (modelLinkSub: Subject<Partial<IProduct>>) => {
	useEffect(() => {

		const subscription = modelLinkSub.subscribe(({ arObjectUrl, cubemap }) => {
			const assetContainer = document.querySelector('#assetContainer');

			// load asset
			const assetItemEl = document.querySelector('a-scene a-asset-item#model');
			assetItemEl?.remove();

			const newAssetEl = document.createElement('a-asset-item');
			newAssetEl.setAttribute('id', 'model');
			newAssetEl.setAttribute('src', arObjectUrl || "");
			assetContainer?.insertAdjacentElement('afterbegin', newAssetEl);

			// cubemap
			if (cubemap && Object.values(cubemap).filter(v => !!v).length === 6) {
				Object.keys(cubemap).forEach((key) => {

					const cubemapImg = document.createElement("img");
					cubemapImg.setAttribute("id", key);
					cubemapImg.setAttribute("crossorigin", "anonymous");
					cubemapImg.setAttribute("src", cubemap[key as keyof IProduct["cubemap"]]);

					assetContainer?.insertAdjacentElement('beforeend', cubemapImg);
				})
			}

			// bind entity to ascene
			const modelContainer = document.querySelector('#modelContainer');
			// reset parent scale & rotation
			// modelContainer?.setAttribute('scale', "1 1 1");
			// modelContainer?.setAttribute('rotation', "0 0 0");
			if (!!modelContainer) {
				modelContainer.innerHTML = '';
				const entity = document.createElement('a-entity') as Scene;
				// const entity = document.createElement('a-entity') as AFrameElement;
				entity.setAttribute('id', 'modelEntity');
				entity.setAttribute('gltf-model', '#model');
				// FIXME debug only
				// entity.setAttribute('position', '0 0 .5');
				// entity.setAttribute('rotation', '-90 0 0');
				// entity.setAttribute('scale', '5 5 5');
				// entity.setAttribute('xrextras-hold-drag', 'rise-height: 0');
				// entity.setAttribute('xrextras-two-finger-rotate', '');
				entity.setAttribute('cubemap-static', '')
				// FIXME absolute scale proximity settings
				entity.setAttribute('proximity', '');
				// FIXME change model color feature
				// entity.setAttribute('change-color', '')
				entity.setAttribute('shadow', 'receive: false');
				entity.setAttribute('animation-mixer', {
					clip: 'none',
					loop: 'once',
					clampWhenFinished: 'true',
				});
				entity.setAttribute(modelRef, '');
				modelContainer?.appendChild(entity);
			}
		})

		return () => { subscription.unsubscribe(); }
	}, [modelLinkSub])
}

export default useInsertModel;
