import { useEffect } from "react";
import { Subject } from "rxjs";
import { IProductHotspot } from "src/core/declarations/app";

const useInsertHotspots = (aFrameModelLoadedEvent: Subject<any>, hotspots?: IProductHotspot[]) => {
  useEffect(() => {

    const subscription = aFrameModelLoadedEvent.subscribe(() => {
      if (!hotspots) return;
      const fragments = hotspots.map(hotspot => {
        const text = `text:${hotspot.text};`
        const labelDistance = !!hotspot.labelDistance ? `labeldistance: ${hotspot.labelDistance};` : "";
        const hsdistance = !!hotspot.hsdistance ? `hsdistance: ${hotspot.hsdistance};` : "";
        const offsetY = !!hotspot.offsetY ? `offsetY: ${hotspot.offsetY};` : "";
        return `
        <a-sphere
          id="hotspot-${hotspot.id}" 
          position="${hotspot.position.x} ${hotspot.position.y} ${hotspot.position.z}" 
          annotation="${text.concat(labelDistance).concat(hsdistance).concat(offsetY)}"
        ></a-sphere>
        `;
      }).join("");

      const documentFragment = document.createRange().createContextualFragment(fragments);

      const modelEntity = document.querySelector("#modelEntity");
      modelEntity.appendChild(documentFragment);
    });

    return () => { subscription.unsubscribe(); }
  }, [aFrameModelLoadedEvent, hotspots])
}

export default useInsertHotspots;
