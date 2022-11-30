import { Entity, Scene } from "aframe";
import { useEffect } from "react";
import { pairwise, startWith, Subject } from "rxjs";
import { IProduct } from "src/core/declarations/app";
import { modelRef, ProductTypes } from "src/core/declarations/enum";

const useInsertModel = (modelLinkSub: Subject<IProduct>) => {
	useEffect(() => {

		const subscription = modelLinkSub
			.pipe(
				startWith(null),
				pairwise()
			).subscribe(([prev, cur]) => {
				if (cur === null) return;

				const assetContainer = document.querySelector('#assetContainer');
				const { id,
					arObjectUrl,
					arModelScale,
					alphaVideoUrl,
					alphaVideoBgColor,
					alphaVideoScale,
					alphaVideoPosition,
					cubemap,
					productType,
				} = cur;
				// load asset
				// clean up either AR object or alpha video
				if (prev?.id !== cur.id && prev?.productType === ProductTypes.arObject) {
					const assetItemEl = document.querySelector('a-scene a-asset-item#model');
					assetItemEl?.remove();
				}

				const alphaVideoWrapperEl = document.querySelector('a-scene span#alphaVideoWrapper');
				if (!!alphaVideoWrapperEl) alphaVideoWrapperEl.innerHTML = '';

				if (productType === ProductTypes.arObject && prev?.id !== cur.id) {
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
					const arObjectScale = arModelScale || "1 1 1";

					// reset parent scale & rotation
					modelContainer?.setAttribute('scale', "1 1 1");
					modelContainer?.setAttribute('rotation', "0 0 0");
					if (!!modelContainer) {
						modelContainer.innerHTML = '';
						const entity = document.createElement('a-entity') as Scene; // FIXME wrong name Scene
						// const entity = document.createElement('a-entity') as AFrameElement;
						entity.setAttribute('id', 'modelEntity');
						entity.setAttribute('gltf-model', '#model');
						// FIXME debug only
						// entity.setAttribute('position', '0 0 .5');
						// entity.setAttribute('rotation', '-90 0 0');
						// entity.setAttribute('scale', '5 5 5');
						// entity.setAttribute('xrextras-hold-drag', 'rise-height: 0');
						// entity.setAttribute('xrextras-two-finger-rotate', '');
						entity.setAttribute('scale', arObjectScale);

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

					// TODO an alpha video product has the same mechanism as an alpha video button effect
					// thus these should be handled with the same module
					// currently the app structure is mixed => need to implement in the restructure task
					// overlay video efect

					// append current product data
					if (!!alphaVideoWrapperEl && alphaVideoUrl) {
						// loop="true"
						alphaVideoWrapperEl.innerHTML = `
						<video
							id="alphaVideo${id}"
							playsinline
							class="alpha-video-product"
							preload="auto"
							src="${alphaVideoUrl}" 
							type="video/mp4"
							crossorigin="anonymous"
						>
						</video>
					`;

						// FIXME

						const alphaVideoProduct = document.querySelector(`#alphaVideo${id}`) as Entity<HTMLVideoElement>;
						alphaVideoProduct?.addEventListener("canplaythrough", () => {
							if (!!alphaVideoProduct) {
								try {
									const alphaVideoMesh = document.querySelector('#alphaVideoMesh');
									alphaVideoMesh?.removeAttribute("play-video");
									alphaVideoMesh?.removeAttribute("material");
									alphaVideoMesh?.removeAttribute("position");

									alphaVideoMesh?.removeAttribute("scale");
									alphaVideoMesh?.setAttribute('play-video', `video: #alphaVideo${id}`);
									alphaVideoMesh?.setAttribute('material', `shader: chromakey; src: #alphaVideo${id}; color: ${alphaVideoBgColor}; side: double; depthTest: true;`);
									alphaVideoMesh?.setAttribute("position", alphaVideoPosition);
									alphaVideoMesh?.setAttribute("scale", alphaVideoScale);
									setTimeout(() => {
										alphaVideoMesh?.setAttribute('visible', 'true'); //disable water video
									}, 500)
								} catch (ex) {
									console.error(ex);
								}
							}
						})
					}
				}
			})

		return () => { subscription.unsubscribe(); }
	}, [modelLinkSub])
}

export default useInsertModel;
