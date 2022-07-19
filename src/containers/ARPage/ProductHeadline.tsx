import { Grid, Typography, Fade } from '@mui/material';
import React, { forwardRef, memo, useEffect, useState } from 'react';
import { useAppContext } from 'src/core/store';
import { useQueryClient } from 'react-query';
import { QueryKeys } from 'src/core/declarations/enum';
import { IProduct } from 'src/core/declarations/app';

interface IProductHeadlineProps {
  productName?: string;
  productClaim?: string;
}

const ProductHeadline = memo(forwardRef<HTMLDivElement, IProductHeadlineProps>(({ productName, productClaim }: IProductHeadlineProps, ref) => {

  const queryClient = useQueryClient();
  const product = queryClient.getQueryData<IProduct>(QueryKeys.product) as IProduct;

  const { productClaimToggleEvent } = useAppContext();
  const [productClaimDisplay, setProductClaimDisplay] = useState(true);

  useEffect(() => {
    if (productClaimToggleEvent) {
      const subscription = productClaimToggleEvent.subscribe(shouldProductClaimDisplay => {
        setProductClaimDisplay(shouldProductClaimDisplay);
      });

      return () => { subscription.unsubscribe(); }
    }

  }, [productClaimToggleEvent]);

  return (
    <Fade appear={false} in={productClaimDisplay}>
      <Grid ref={ref} sx={theme => ({
        width: '100%',
        // eslint-disable-next-line no-useless-escape
        bgcolor: theme => /^\#[0-9abcdef]{6}$/i.test((product && product.bgColor) || '') ? product.bgColor : theme.background.cyan,
        px: 2,
        py: 1,
        minHeight: '40px',
        zIndex: 1,
        ...(theme.arPageStyles?.productClaim.root)
      })}>
        <Typography sx={theme => ({
          ...(theme.arPageStyles?.productClaim.text)
        })}>{`${productName} - ${productClaim}`}</Typography>
      </Grid>
    </Fade>
  )
}));

export default ProductHeadline;
