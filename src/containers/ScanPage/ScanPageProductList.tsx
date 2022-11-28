import { Skeleton, IconButton } from '@mui/material';
import React, { memo, useState, useMemo, useEffect } from 'react';
import { LazyImage } from 'src/components';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';
import { useBoundStore } from 'src/core/store';

const ScanPageProductList: React.FC = memo(() => {
  const { i18n } = useTranslation();
  const history = useHistory();

  const [productId, setProductId] = useState('');

  const store = useBoundStore(state => state.store);

  const { product, productsByQrCode, productsByQrCodeStatus, getAllProductsByQRCode, getProductById } = useBoundStore(state => ({
    product: state.product,
    productsByQrCode: state.productsByQrCode,
    productsByQrCodeStatus: state.productsByQrCodeStatus,
    getAllProductsByQRCode: state.getAllProductsByQRCode,
    getProductById: state.getById
  }));

  useEffect(() => {
    if (!!store?.id) getAllProductsByQRCode(store.id, i18n.language);
  }, [getAllProductsByQRCode, store, i18n.language])

  // TODO: temporary only 4 product from product list should be displayed
  // need discussion
  const topProducts = useMemo(() => productsByQrCode?.slice(0, 4), [productsByQrCode]);

  useEffect(() => {
    if (productId && store?.id) getProductById(productId, i18n.language, store?.id)
  }, [getProductById, productId, i18n.language, store?.id])

  useEffect(() => {
    if (!!product) {
      history.push({
        pathname: '/ar-page',
        state: { productId: product?.id }
      })
    }

  }, [history, product])

  if (productsByQrCodeStatus)
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

export default ScanPageProductList;
