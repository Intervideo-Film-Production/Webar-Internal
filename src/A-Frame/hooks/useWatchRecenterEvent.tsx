import { useEffect } from "react";
import { Subject } from "rxjs";
import { AFrameElement } from "src/core/declarations/app";

const useWatchRecenterEvent = (recenterEvent?: Subject<any>) => {
	useEffect(() => {
		// recenter event
		if (recenterEvent) {
			const aFrameComponent = document.querySelector('a-scene') as AFrameElement | null;

			const subscription = recenterEvent.subscribe(() => {

				if (aFrameComponent !== null && aFrameComponent !== undefined) { aFrameComponent.emit('recenter') }
				else { console.log('A-Frame scene not defined') }

			})

			return () => { subscription.unsubscribe() }
		}

	}, [recenterEvent]);
}

export default useWatchRecenterEvent;
