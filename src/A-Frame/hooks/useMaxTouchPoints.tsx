import { useEffect } from "react"

// to fix rendering issue on iOS
const useMaxTouchPoints = () => {
	useEffect(() => {
		const IS_IOS =
			/^(iPad|iPhone|iPod)/.test(window.navigator.userAgent) ||
			(/^Mac/.test(window.navigator.userAgent) && window.navigator.maxTouchPoints > 1)
		if (IS_IOS) {
			(window.createImageBitmap as any) = undefined
		}
	}, [])
}

export default useMaxTouchPoints;