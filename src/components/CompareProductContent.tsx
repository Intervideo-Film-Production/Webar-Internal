import React, { memo } from 'react';
import { Typography, Grid, Box, BoxProps } from '@mui/material';
import { IProduct } from 'src/core/declarations/app';
import { LazyImage } from 'src/components';
import { urlFor } from 'src/crud/api';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { useAppContext } from 'src/core/store';

interface ICompareProductContentProps {
  product: IProduct;
  children?: React.ReactNode;
}

const CompareProductContent = memo((props: ICompareProductContentProps & BoxProps) => {
  const { appTheme } = useAppContext();
  const { product, sx, children } = props;
  return (<Box sx={{
    width: '100%',
    height: '100%',
    position: 'relative',
    ...sx,
  }}
  >
    <LazyImage
      styles={{
        ...(process.env.REACT_APP_STATIC_DATA === 'TRUE' && {
          backgroundColor: product.bgColor,
          objectFit: 'cover',
          objectPosition: 'top'
        }),
        ...appTheme.getValue().arPageStyles.productCompareBox
      }}
      src={
        !product.searchImage || (typeof product.searchImage !== 'string' && !product.searchImage.asset)
          ? undefined
          : process.env.REACT_APP_STATIC_DATA !== 'TRUE'
            ? urlFor(product.searchImage).width(180).height(180).bg(product.bgColor.slice(1, product.bgColor.length))
            : (product.searchImage as { [key: string]: any }).url
      }
      noImageComponent={<Grid sx={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        background: 'grey',
        ...appTheme.getValue().arPageStyles.productCompareBox
      }}>
        <Grid sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ImageNotSupportedIcon />

        </Grid>
      </Grid>}
    />
    <Typography sx={{
      color: product.fgColor || "#fff",
      position: "absolute",
      whiteSpace: "pre-wrap",
      fontWeight: 700,
      top: theme => theme.spacing(1),
      left: theme => theme.spacing(1)
    }}>{product.name}</Typography>
    {children}
  </Box >)
});

export default CompareProductContent;
