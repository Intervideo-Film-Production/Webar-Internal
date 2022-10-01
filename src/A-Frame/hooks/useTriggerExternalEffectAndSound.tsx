import { useEffect } from "react";
import { Subject } from "rxjs";

const useTriggerExternalEffectAndSound = (onButtonClick: (buttonName: string) => any, buttonHandleEvent: Subject<string>) => {
	useEffect(() => {
		if (onButtonClick && buttonHandleEvent) {
			const subscription = buttonHandleEvent.subscribe((buttonName: string) => {
				// trigger content outside
				onButtonClick(buttonName);

				// play sound if any
				const buttonAudio = document.querySelector(`#btn-audio-${buttonName}`) as HTMLAudioElement;
				buttonAudio?.play();

				// TODO stop playing audio when if button content is closed
			})

			return () => { subscription.unsubscribe() }
		}
	}, [onButtonClick, buttonHandleEvent])
}

export default useTriggerExternalEffectAndSound;
