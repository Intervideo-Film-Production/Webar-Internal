import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { filter, interval, Observable, throttle } from "rxjs";
import { IQRCodeData } from "src/core/declarations/app";
import { QueryKeys } from "src/core/declarations/enum";
import { getProduct, getProductById } from "src/crud";

const useProductQRValue = (cameraEvent: Observable<string>) => {
	const { i18n } = useTranslation();
	const [productQrText, setProductQrText] = useState("");
	const queryClient = useQueryClient();

	const qrCodeData = queryClient.getQueryData<IQRCodeData>(QueryKeys.qrCode);

	// FIXME not sure if language changed this query will be updated
	const { isFetching, data, isError } = useQuery(
		[QueryKeys.product],
		() => getProduct(productQrText, i18n.language, qrCodeData?.id as string),
		{
			enabled: !!productQrText,
			cacheTime: Infinity,
		}
	);

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
	}, []);

	return { isFetching, isError, productName: data?.name, productQrText };
}

export default useProductQRValue;
