import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { filter, interval, Observable, throttle } from "rxjs";
import { StoreStatus } from "src/core/declarations/enum";
import { useBoundStore } from "src/core/store";

const useProductQRValue = (cameraEvent: Observable<string>) => {
	const { i18n } = useTranslation();
	const [productQrText, setProductQrText] = useState("");

	const store = useBoundStore(state => state.store);
	const { product, productStatus, getByQR } = useBoundStore(state => ({
		product: state.product,
		productStatus: state.productStatus,
		getByQR: state.getByQR
	}))
	// FIXME not sure if language changed this query will be updated
	const fetchProduct = useCallback(() => {
		if (!store?.id) return;
		return getByQR(productQrText, i18n.language, store?.id);
	}, [productQrText, store, i18n.language, getByQR])

	useEffect(() => {
		if (!!productQrText) fetchProduct();
	}, [productQrText, fetchProduct])

	useEffect(() => {
		const subscription = cameraEvent
			.pipe(
				// filter all empty values
				filter((v) => !!v),
				// take value once every half second
				throttle(() => interval(150))
			)
			.subscribe((foundProductQrText) => {
				if (productQrText !== foundProductQrText) {
					// found another text set new product Qr text
					setProductQrText(foundProductQrText);
				}
			});

		return () => {
			subscription.unsubscribe();
		};
	}, [cameraEvent, productQrText]);

	return {
		isFetching: productStatus === StoreStatus.loading,
		isError: productStatus === StoreStatus.loaded && !product,
		productName: product?.name,
		productQrText
	};
}

export default useProductQRValue;
