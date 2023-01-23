import { Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';

import { AppButton } from 'src/components';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { StoreStatus } from 'src/core/declarations/enum';

// const ScanPageProductList: React.FC = memo(() => {
//   const { i18n } = useTranslation();
//   const navigate = useNavigate();

//   const [productId, setProductId] = useState('');

//   const store = useBoundStore(state => state.store);

//   const { product, productsByQrCode, productsByQrCodeStatus, getAllProductsByQRCode, getProductById } = useBoundStore(state => ({
//     product: state.product,
//     productsByQrCode: state.productsByQrCode,
//     productsByQrCodeStatus: state.productsByQrCodeStatus,
//     getAllProductsByQRCode: state.getAllProductsByQRCode,
//     getProductById: state.getById
//   }));

//   useEffect(() => {
//     if (!!store?.id) getAllProductsByQRCode(store.id, i18n.language);
//   }, [getAllProductsByQRCode, store, i18n.language])

//   // TODO: temporary only 4 product from product list should be displayed
//   // need discussion
//   const topProducts = useMemo(() => productsByQrCode?.slice(0, 4), [productsByQrCode]);

//   useEffect(() => {
//     if (productId && store?.id) getProductById(productId, i18n.language, store?.id)
//   }, [getProductById, productId, i18n.language, store?.id])

//   useEffect(() => {
//     if (!!product) {
//       navigate('/ar-page', {
//         state: { productId: product?.id }
//       })
//     }

//   }, [navigate, product])

//   if (productsByQrCodeStatus)
//     return (<>
//       <Skeleton sx={{ margin: '0px 7px' }} variant="circular" width={60} height={60} />
//       <Skeleton sx={{ margin: '0px 7px' }} variant="circular" width={60} height={60} />
//       <Skeleton sx={{ margin: '0px 7px' }} variant="circular" width={60} height={60} />
//       <Skeleton sx={{ margin: '0px 7px' }} variant="circular" width={60} height={60} />
//     </>)

//   return (
//     <>
//       {
//         topProducts?.map(product => (
//           <IconButton
//             key={`pre-shown-product-${product.id}`}
//             sx={{ width: '60px', height: '60px', margin: '0px 7px', overflow: 'hidden', p: 0 }}
//             onClick={() => setProductId(product.id)}
//           >
//             <LazyImage src={product.image} />
//           </IconButton>
//         ))
//       }
//     </>
//   )
// });

interface IScanPageDetailsProps {
  isFetching: StoreStatus;
  isError: boolean;
  itemName?: string;
}

const ScanPageDetails: React.FC<IScanPageDetailsProps> = (props) => {
  const { isFetching, isError, itemName } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(isError, itemName, isFetching);
  }, [isError, itemName, isFetching])

  return (
    <Grid
      sx={{
        textAlign: "center",
        marginBottom: 7,
        marginTop: 3,
        position: "absolute",
        bottom: 0,
        width: "100%",
        zIndex: 5,
      }}
    >
      <Typography
        variant="h5"
        sx={(theme) => theme.scanPageStyles.resultText}
      >
        {isFetching === StoreStatus.loading && t("ScanPageFetchText")}
        {isFetching === StoreStatus.loaded &&
          (isError || !itemName) &&
          t("ScanPageQRCodeNotCorrectText")}
        {!!itemName && (
          <>
            {t("ScanPageFoundProductText")}
            <span id="scanPageFoundProduct">{itemName}</span>
          </>
        )}
      </Typography>

      {/* <Grid sx={{
        display: !!itemName ? 'none' : 'block'
      }}>
        <Typography sx={{ opacity: 0.7, mb: 2 }} variant="h3">
          {t("ScanPageDirectSelectionText")}
        </Typography>

        <ScanPageProductList />
      </Grid> */}

      <AppButton
        onClick={() => { navigate('/categories') }}
        variant="contained"
        sx={theme => ({
          whiteSpace: 'pre-wrap',
          ...theme.scanPageStyles.productFinderButton
        })}
      >{t("ScanPageHelperButtonText")}</AppButton>
    </Grid>
  )
}

export default ScanPageDetails;
