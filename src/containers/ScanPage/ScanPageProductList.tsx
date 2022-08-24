import { Skeleton, IconButton } from '@mui/material';
import React, { memo, useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { LazyImage } from 'src/components';
import { QueryKeys } from 'src/core/declarations/enum';
import { getAllProductsByQRCode, getProductById } from 'src/crud/crud';
import { useTranslation } from "react-i18next";
import { IQRCodeData } from 'src/core/declarations/app';
import { useHistory } from 'react-router-dom';

const ScanPageProductList: React.FC = memo(() => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const history = useHistory();

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
      history.push({
        pathname: '/ar-page',
        state: { productId: productByIdData?.id }
      })
    }

  }, [history, productByIdData])

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

export default ScanPageProductList;
