import { useEffect } from "react";
import { Subject } from "rxjs";

const useWatchRecenterEvent = (recenterEvent?: Subject<any>) => {
	useEffect(() => {
		// recenter event
		if (recenterEvent) {
			const aFrameComponent = document.querySelector('a-scene');

			const subscription = recenterEvent.subscribe(() => {

				if (aFrameComponent !== null && aFrameComponent !== undefined) { aFrameComponent.emit('recenter') }
				else { console.log('A-Frame scene not defined') }

			})

			return () => { subscription.unsubscribe() }
		}

	}, [recenterEvent]);
}

export default useWatchRecenterEvent;
