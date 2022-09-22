import { Skeleton, IconButton, Grid, Typography } from '@mui/material';
import React, { memo, useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { AppButton, LazyImage } from 'src/components';
import { QueryKeys } from 'src/core/declarations/enum';
import { getAllProductsByQRCode, getProductById } from 'src/crud/crud';
import { useTranslation } from "react-i18next";
import { IQRCodeData } from 'src/core/declarations/app';
import { useNavigate } from 'react-router-dom';

const ScanPageProductList: React.FC = memo(() => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [productId, setProductId] = useState('');

  const qrCodeData = queryClient.getQueryData<IQRCodeData>(QueryKeys.qrCode);

  const { isLoading, data } = useQuery(
    QueryKeys.productsListByQRCode,
    () => getAllProductsByQRCode(qrCodeData?.id as string, i18n.language)
  )

  // TODO: temporary only 4 product from product list should be displayed
  // need discussion
  const topProducts = useMemo(() => data?.slice(0, 4), [data]);

  const { data: productByIdData } = useQuery(
    [QueryKeys.product, productId],
    () => getProductById(productId, i18n.language, qrCodeData?.id as string),
    {
      enabled: !!productId
    }
  )

  useEffect(() => {
    if (!!productByIdData) {
      navigate('/ar-page', {
        state: { productId: productByIdData?.id }
      })
    }

  }, [navigate, productByIdData])

  if (isLoading)
    return (<>
      <Skeleton sx={{ margin: '0px 7px' }} variant="circular" width={60} height={60} />
      <Skeleton sx={{ margin: '0px 7px' }} variant="circular" width={60} height={60} />
      <Skeleton sx={{ margin: '0px 7px' }} variant="circular" width={60} height={60} />
      <Skeleton sx={{ margin: '0px 7px' }} variant="circular" width={60} height={60} />
    </>)

  return (
    <>
      {
        topProducts?.map(product => (
          <IconButton
            key={`pre-shown-product-${product.id}`}
            sx={{ width: '60px', height: '60px', margin: '0px 7px', overflow: 'hidden', p: 0 }}
            onClick={() => setProductId(product.id)}
          >
            <LazyImage src={product.image} />
          </IconButton>
        ))
      }
    </>
  )
});

interface IScanPageDetailsProps {
  isFetching: boolean;
  isError: boolean;
  itemName?: string;
}

const ScanPageDetails: React.FC<IScanPageDetailsProps> = (props) => {
  const { isFetching, isError, itemName } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();


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
        {isFetching && t("ScanPageFetchText")}
        {!isFetching &&
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
        onClick={() => { navigate('/product-finder') }}
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
