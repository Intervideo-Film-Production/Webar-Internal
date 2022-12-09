import { useEffect } from "react";
import { Subject, map } from "rxjs";
import { IButtonContent, AFrameElement } from "src/core/declarations/app";
import { Entity } from 'aframe';

const useInsertButtonOverlays = (buttonListSub: Subject<IButtonContent[]>) => {
  useEffect(() => {
    const arModelOverlaysSub = buttonListSub.pipe(
      map(list => list.filter(b => !!b.arModelOverlay)
        .map<Pick<IButtonContent, 'buttonName' | 'arModelOverlay'>>(({ buttonName, arModelOverlay }) => ({ buttonName, arModelOverlay }))
      )
    );

    const subscription = arModelOverlaysSub.subscribe(arModelOverlays => {
      // overlay video efect
      const alphaVideoWrapperEl = document.querySelector('a-scene span#alphaVideoWrapper');

      // clear previous model overlays
      const allModelOverlays = alphaVideoWrapperEl?.querySelectorAll(".alpha-video");
      allModelOverlays?.forEach(el => el.remove());

      // append current product data
      if (!!alphaVideoWrapperEl && arModelOverlays.length > 0) {
        arModelOverlays.forEach(({ buttonName, arModelOverlay }) => {
          // loop="true"
          const newAlphaVideoEl = document.createElement("video");
          newAlphaVideoEl.id = `alphaVideo${buttonName}`;
          newAlphaVideoEl.setAttribute("playsinline", "");
          newAlphaVideoEl.className = "alpha-video";
          newAlphaVideoEl.setAttribute("preload", "auto");
          newAlphaVideoEl.setAttribute("src", arModelOverlay);
          newAlphaVideoEl.setAttribute("type", "video/mp4");
          newAlphaVideoEl.setAttribute("crossorigin", "anonymous");

          alphaVideoWrapperEl.insertAdjacentElement("beforeend", newAlphaVideoEl);
        });
      }


    });

    return () => { subscription.unsubscribe(); }
  }, [buttonListSub])
}

export default useInsertButtonOverlays;
