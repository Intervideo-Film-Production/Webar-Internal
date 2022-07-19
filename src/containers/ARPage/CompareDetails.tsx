
import { Grid, Typography, Dialog, Toolbar, DialogContent } from '@mui/material';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AppButton, AppGrid, LazyImage, LoadingBox, VideoJS } from '../../components';
import { styled } from '@mui/material/styles';
import Divider from "@mui/material/Divider";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useQuery, useQueryClient } from 'react-query';
import { QueryKeys } from 'src/core/declarations/enum';
import { getProductById } from 'src/crud/crud';
import { IProduct, IQRCodeData } from 'src/core/declarations/app';
import { urlFor } from 'src/crud/api';
import BlockContent, { BlockContentProps } from '@sanity/block-content-to-react';
import { makeStyles } from '@mui/styles';
import { useAppContext } from 'src/core/store';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const projectId: string = process.env.REACT_APP_PROJECT_ID as string;
const dataset: string = process.env.REACT_APP_DATASET as string;

interface IStyledComparisonProps {
	product: IProduct;
	isCompareProduct?: boolean;
}

const CompareDivider = styled(Divider)(({ theme }) => ({
	opacity: .6,
	...theme.arPageStyles?.compareDetails.divider
}))

const inlineImageStyles = makeStyles(() => ({
	featureImage: {
		maxHeight: '30px',
		marginBottom: '5px',
		objectFit: 'fill'
	},
	firstImage: {
		width: '30px',
		height: '30px',
		marginRight: '5px',
		objectFit: 'contain'
	},
	nextImage: {
		alignSelf: 'center',
		height: 'auto !important'
	}
}));

const InlineImage = memo(({ imgObj, isFirst }: { imgObj: any, isFirst: boolean }) => {
	const classes = inlineImageStyles();

	const imageRef = useRef<{ self: () => HTMLImageElement | null }>(null);

	const imageLoadHandle = useCallback(() => {
		const img = imageRef.current?.self();
		if (!!img) {
			img.setAttribute('style', 'width: calc(100% - 35px)');
			// if the second image's height is less than 26px, the image should be in the next line
			if (img.height < 26) {
				img.removeAttribute('style');
			}
		}
	}, []);

	return (
		<LazyImage
			ref={imageRef}
			className={`${classes.featureImage} ${isFirst ? classes.firstImage : classes.nextImage}`}
			src={process.env.REACT_APP_STATIC_DATA !== 'TRUE' ? urlFor(imgObj.image.asset) : imgObj.url}
			onImageLoad={isFirst ? undefined : imageLoadHandle}
		/>
	)
});

const EmptyFeature = memo(styled(Grid)({
	width: '30px',
	height: '3px',
	borderRadius: '1.5px',
	background: '#000',
	opacity: .5,
	margin: 'auto'
}))

const useStyles = makeStyles(() => ({
	navigationButtonBlock: {
		position: 'sticky',
		paddingTop: '5px',
		top: 0,
		zIndex: 3
	},
	textBlock: {
		paddingLeft: '10px',
		paddingRight: '10px'
	},
	blockContent: {
		'& p': {
			color: 'currentcolor',
			letterSpacing: '-.5px',
			wordSpacing: '-1.5px',
			margin: 0
		},
		'& p:last-child': {
			marginBottom: '5px'
		}
	}
}));

const ComparisonData = memo(({ product, isCompareProduct }: IStyledComparisonProps) => {
	const { appTheme } = useAppContext();
	const classes = useStyles();
	const column = isCompareProduct ? 3 : 1;

	const serializers = useMemo<BlockContentProps['serializers']>(() => ({
		types: {
			inlineImage: ({ node: { imageArray } }) => {
				return (
					<Grid sx={{
						display: 'flex',
						flexWrap: 'wrap',
					}}>
						{imageArray.map((imgObj: any, idx: number) => (
							<InlineImage
								key={`product-feature-image-${idx}`}
								imgObj={imgObj}
								isFirst={idx === 0}
							/>
						))}
					</Grid>
				);
			},
			image: ({ node: { metadata, url } }) => (
				<LazyImage src={url} styles={{
					maxHeight: '200px',
					objectFit: 'contain'
				}} />
			),
			file: ({ node: { url, previewImage } }) => {
				return (<VideoJS
					sources={[url]}
					poster={previewImage &&
						(process.env.REACT_APP_STATIC_DATA !== 'TRUE'
							? urlFor(previewImage.asset).width(100).auto('format').fit('max').url()
							: previewImage.url)}
				/>)
			}
		},
	}), []);

	return (
		<>
			{/* product image */}
			<Grid sx={{
				gridArea: `2 / ${column} /2 / ${column}`
			}}>
				<Grid sx={{
					width: '100%',
					paddingBottom: '100%',
					position: 'relative',
					mb: 1,
					color: '#000'
				}}>
					{/* FIXME duplicate CompareProductContent need refactor */}
					<LazyImage
						styles={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							top: 0,
							left: 0,
							objectFit: 'cover',
							objectPosition: 'top',
							backgroundColor: product.bgColor,
							...appTheme.getValue().arPageStyles.productCompareBox
						}}
						src={
							!product.searchImage || (typeof product.searchImage !== 'string' && !product.searchImage.asset)
								? undefined
								: (process.env.REACT_APP_STATIC_DATA !== 'TRUE'
									? urlFor(product.searchImage).bg(product.bgColor.slice(1, product.bgColor.length))
									: (product.searchImage as { [key: string]: any }).url)
						}

						noImageComponent={
							<Grid sx={{
								width: '100%',
								height: '100%',
								position: 'absolute',
								backgroundColor: product.bgColor,
								top: 0,
								left: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								...appTheme.getValue().arPageStyles.productCompareBox
							}}>
								<ImageNotSupportedIcon />

							</Grid>}
					/>

					{
						(!product.searchImage || (typeof product.searchImage !== 'string' && !product.searchImage.asset))
							? (<></>)
							: (<Typography
								sx={{
									color: product.fgColor || "#fff",
									position: 'absolute',
									fontWeight: 700,
									top: theme => theme.spacing(1),
									left: theme => theme.spacing(1)
								}}>{product.name}</Typography>)
					}
				</Grid>
			</Grid>

			{/* product feature description */}
			<Grid className={classes.textBlock} sx={{
				gridArea: `3 / ${column} /3 / ${column}`,
				mb: 1
			}}>
				<Typography sx={theme => ({ ...theme.arPageStyles?.compareDetails.productDescription })}>{product.productFeaturesDescription}</Typography>
			</Grid>

			{/* product features */}
			{
				product.productFeatures && product.productFeatures.map((feature, idx) => {
					return (
						<Grid
							className={classes.textBlock}
							key={`product-feature-${idx}`}
							sx={theme => ({
								gridArea: `${4 + idx} / ${column} / ${4 + idx} / ${column}`,
								mt: 1,
								display: 'flex',
								flexDirection: 'column',
								...theme.arPageStyles?.compareDetails.compareItems
							})}
						>
							{isEmptyBlock(feature)
								? (
									<>
										<EmptyFeature />
										{(idx !== product.productFeatures.length - 1) && (<CompareDivider />)}
									</>
								)
								: (
									<>
										<BlockContent
											className={classes.blockContent}
											serializers={serializers}
											blocks={feature}
											imageOptions={{ w: 400, auto: 'format', fit: 'max' }}
											projectId={projectId}
											dataset={dataset}
										/>
										{(idx !== product.productFeatures.length - 1) && (<CompareDivider sx={{
											mt: 'auto'
										}} />)}
									</>
								)}
						</Grid>
					)
				})
			}
		</>
	)
})

interface ICompareDetailsProps {
	open: boolean;
	compareProductId: string;
	onCompareDetailsClose?: (shouldCloseCompareDrawer?: boolean) => void;
}

const isEmptyBlock = (blocks: { [key: string]: any }[]) => {
	if (!blocks) return true;
	if (blocks.some(b => b._type !== 'block')) return false;
	return blocks.every(b => b.children.every((c: { [key: string]: any }) => /^\s*$/g.test(c.text)));
}

const CompareDetails = memo(({ open, compareProductId, onCompareDetailsClose }: ICompareDetailsProps) => {
	const classes = useStyles();
	const { t, i18n } = useTranslation();
	const queryClient = useQueryClient();
	const qrCodeData = queryClient.getQueryData<IQRCodeData>(QueryKeys.qrCode);
	const selectedProduct = queryClient.getQueryData<IProduct>(QueryKeys.product);
	const { appLoadingStateEvent, productClaimToggleEvent } = useAppContext();

	const { isFetching, refetch, data } = useQuery<IProduct | null>(QueryKeys.compareProduct, () => getProductById(compareProductId, i18n.language, qrCodeData?.id as string), {
		enabled: false
	});

	useEffect(() => {
		if (compareProductId && refetch) {
			refetch();
		}
	}, [compareProductId, refetch])

	const productFeatureLength = useMemo(() => {
		if (selectedProduct && data && (selectedProduct.productFeatures || data.productFeatures)) {
			const selectedProductFeatureLength = !!selectedProduct.productFeatures ? selectedProduct.productFeatures.length : 0;
			const compareProductFeatureLength = !!data.productFeatures ? data.productFeatures.length : 0;
			return selectedProductFeatureLength > compareProductFeatureLength
				? selectedProductFeatureLength
				: compareProductFeatureLength;
		} else {
			return 0;
		}
	}, [selectedProduct, data])

	const handleCompareToggle = (shouldCloseCompareDrawer?: boolean) => {
		if (onCompareDetailsClose) onCompareDetailsClose(shouldCloseCompareDrawer);
	}

	const handleOpenNewProductAR = () => {
		queryClient.setQueryData(QueryKeys.product, () => data);
		queryClient.removeQueries(QueryKeys.compareProduct);
		queryClient.removeQueries(QueryKeys.productComments);
		queryClient.removeQueries(QueryKeys.compareProducts);
		queryClient.removeQueries(QueryKeys.buttonAnimationContent);

		handleCompareToggle(true);
		productClaimToggleEvent.next(true);
		appLoadingStateEvent.next(true);
	}

	return (
		<Dialog
			fullScreen
			open={open}
			scroll="paper"
			PaperProps={{
				sx: {
					backgroundColor: theme => theme.arPageStyles?.compareDetails.backgroundColor || "#fff"
				}
			}}
			onClose={() => handleCompareToggle()}
			keepMounted={true}
		>
			<Toolbar />
			<DialogContent sx={{ padding: '0px 5px', mb: '20px' }} >
				{
					isFetching
						? (<LoadingBox sx={{ height: '100%' }} />)
						: selectedProduct && data && (
							<AppGrid sx={{
								width: '100%',
								gridTemplateColumns: '1fr 1px 1fr',
								columnGap: '5px',
								gridTemplateRows: 'auto '.repeat(productFeatureLength + 3)
							}}>
								{/* divider */}
								<CompareDivider
									sx={{
										gridArea: `1 / 2 / ${productFeatureLength + 4} / 2`
									}}
									orientation="vertical" />

								{/* buttons */}
								<Grid
									className={classes.navigationButtonBlock}
									sx={{
										gridArea: '1 / 1 / 1 / 1',
										pb: 1,
										backgroundColor: theme => theme.arPageStyles?.compareDetails.backgroundColor
									}}>
									<AppButton
										size="small"
										variant="contained"
										startIcon={<ArrowBackIosIcon sx={{ fontSize: "20px" }} />}
										sx={theme => ({
											backgroundColor: selectedProduct?.bgColor,
											...theme.arPageStyles?.compareDetails.navigationButtons
										})
										}
										onClick={() => { handleCompareToggle() }}
									>
										{t('ComparisonDetailBackButtonText')}

									</AppButton>
								</Grid>

								<Grid
									className={classes.navigationButtonBlock}
									sx={{
										gridArea: '1 / 3 / 1 / 3',
										display: 'inline-grid',
										justifyContent: 'flex-end',
										pb: 1,
										backgroundColor: theme => theme.arPageStyles?.compareDetails.backgroundColor
									}}>
									<AppButton
										size="small"
										variant="contained"
										endIcon={<ArrowForwardIosIcon sx={{ fontSize: "20px" }} />}
										sx={theme => ({
											backgroundColor: data?.bgColor,
											...theme.arPageStyles?.compareDetails.navigationButtons
										})}
										onClick={() => { handleOpenNewProductAR() }}
									>
										{t('ComparisonDetailWatcARButtonText')}
									</AppButton>
								</Grid>

								{/* product comparison */}
								{/* current product */}
								<ComparisonData product={selectedProduct} />
								{/* compare product */}
								<ComparisonData product={data} isCompareProduct={true} />

							</AppGrid>
						)
				}
			</DialogContent>

		</Dialog >
	)
});

export default CompareDetails;
