import { useEffect } from "react";
import { Subject } from "rxjs";
import { IButtonContent } from "src/core/declarations/app";

const useInsertButtonSound = (buttonListSub: Subject<IButtonContent[]>) => {
	useEffect(() => {
		const soundWrapper = document.querySelector('a-scene span#soundWrapper');

		const subscription = buttonListSub.subscribe((buttons) => {
			// remove audio
			const allAudios = document.querySelectorAll('a-scene span#soundWrapper audio');
			allAudios.forEach(el => el.remove());

			// load sound files
			buttons.forEach(btn => {
				if (!!btn.sound) {
					const audioEl = document.createElement('audio');
					audioEl.setAttribute('id', `btn-audio-${btn.buttonName}`);
					const audioSource = document.createElement('source');
					audioSource.setAttribute('src', btn.sound);
					audioSource.setAttribute('type', "audio/mp3");
					audioEl.appendChild(audioSource);
					soundWrapper?.appendChild(audioEl);
				}

			})
		})

		return () => { subscription.unsubscribe(); }

	}, [buttonListSub])
}

export default useInsertButtonSound;
