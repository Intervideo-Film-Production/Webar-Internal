import React, { useMemo, forwardRef, ForwardedRef } from 'react';
import { Grid, GridTypeMap, Toolbar, Typography, Box, Slide } from '@mui/material';
import Rating from '@mui/material/Rating';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { AppGrid, LazyImage } from 'src/components';
import { makeStyles } from '@mui/styles';
import { IProduct } from 'src/core/declarations/app';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import ProductHeadline from './ProductHeadline';
import { useAppContext } from 'src/core/store';

interface LoadingScreenProps {
  product: IProduct;
}

interface IStyledRatingsProps {
  averageRatings: number;
  displayNumber?: boolean;
  mainRatingBox?: boolean;
}

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  [`& .${linearProgressClasses.bar}`]: { ...theme.arPageStyles?.loadingScreen?.progressLoadingBar },
}))

// const styledRatingsDefaultStyles = {
//   display: 'inline-flex',
//   alignItems: 'center',
//   justifyItems: 'center',
//   p: '5px'
// };

// const StyledRatings = ({ averageRatings, displayNumber = true, mainRatingBox = false, sx }: IStyledRatingsProps & DefaultComponentProps<GridTypeMap>) => (
//   <Grid sx={theme => ({
//     ...styledRatingsDefaultStyles,
//     ...(theme.arPageStyles.loadingScreen[(mainRatingBox ? 'mainRatingBox' : 'ratingBoxes')].root),
//     ...(sx as object)
//   })}>
//     <Rating
//       sx={theme => ({ ...(theme.arPageStyles.loadingScreen[(mainRatingBox ? 'mainRatingBox' : 'ratingBoxes')].rating) })}
//       readOnly
//       defaultValue={averageRatings}
//       size="medium" />
//     {
//       displayNumber && (<Typography variant="h6" sx={theme => ({
//         lineHeight: 1, px: 1, fontWeight: 'bold',
//         ...(theme.arPageStyles.loadingScreen[(mainRatingBox ? 'mainRatingBox' : 'ratingBoxes')].text)
//       })}>{averageRatings}</Typography>)
//     }
//   </Grid >
// )

const useStyles = makeStyles(() => ({
  contentBlock1: {
    marginTop: 'auto'
  },
  contentBlock2: {
    marginLeft: 'auto'
  },
  contentBlock3: {}
}));

const LoadingScreen = forwardRef(({ product, ...props }: LoadingScreenProps & DefaultComponentProps<GridTypeMap>, ref: ForwardedRef<HTMLDivElement>) => {
  const classes = useStyles();
  const { appTheme } = useAppContext();
  // const blockClass = (blockIndex: number) => {
  //   if (blockIndex === 0) return classes.contentBlock1;
  //   if (blockIndex === 1) return classes.contentBlock2;
  //   if (blockIndex === 2) return classes.contentBlock3;
  // }

  // const averageRatings = useMemo(() => {
  //   const _averageRatings = product.ratings.reduce((a: number, b: number) => a + b, 0) / product.ratings.length;
  //   return Math.floor(_averageRatings * 100) / 100;
  // }, [product.ratings])

  return (
    <AppGrid ref={ref} {...props} sx={(theme: any) => ({
      gridTemplateRows: 'auto auto 1fr',
      flexGrow: 1,
      position: 'fixed',
      pb: 1,
      left: 0,
      right: 0,
      top: 0,
      bottom: '20px', // minus consent area
      zIndex: 900,
      ...theme.arPageStyles?.loadingScreen.root
    })}>
      <Toolbar />
      <Box>
        <CustomLinearProgress />
      </Box>
      <Grid sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto'
      }}>

        {/* {
          !!appTheme.getValue().arPageStyles.loadingScreen.showProductHeadline
            ? (<ProductHeadline productName={product.name} productClaim={product.productClaim} />)
            : (<Grid sx={theme => ({
              ...theme.arPageStyles.loadingScreen.titleBox.root
            })}>
              <Typography sx={theme => theme.arPageStyles.loadingScreen.titleBox.title} variant="h6">{product.name}</Typography>
              <Typography sx={theme => theme.arPageStyles.loadingScreen.titleBox.subtitle}>{product.productClaim}</Typography>
            </Grid>)
        } */}

        {/* TODO Need review how to deal with empty data */}

        {/* {product.ratings.length > 0 && (
          <Slide direction="left" in={true} timeout={{ appear: 300, enter: 500, exit: 1000 }}>
            <Grid sx={{ ml: 'auto', mt: 2, px: 1 }}>
              <StyledRatings averageRatings={averageRatings} mainRatingBox />
            </Grid>
          </Slide>
        )} */}

        {/* TODO Need review how to deal with empty data */}

        {/* {product.comments.length > 0 ?
          product.comments.map(({ stars, comment }, idx: number) =>
          (
            <Slide direction={idx % 2 === 0 ? 'right' : 'left'} key={`comment-excerpt-${idx}`} in={true} timeout={{
              appear: 1000 + idx * 300,
              enter: 1300 + idx * 300,
              exit: 1500 + idx * 300
            }}>
              <Grid className={blockClass(idx)} sx={{px: 1}}>
                <StyledRatings averageRatings={stars} displayNumber={false} />
                <Typography sx={theme => ({
                  ...theme.arPageStyles?.loadingScreen.reviewTexts
                })}>{`${comment.substring(0, 20).trim()}${comment.length > 20 ? ' ...' : ''}`}</Typography>
              </Grid>
            </Slide>
          )
          ) : ""
        } */}
      </Grid>

      <LazyImage src={product.image} alt={product.imageCaption} styles={{
        objectPosition: 'center 22vh',
        position: 'fixed',
        zIndex: -1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        objectFit: 'cover',
        height: "100%",
        width: "70%",
        marginLeft: "9vh"
      }} />
    </AppGrid>
  )
});

export default LoadingScreen;
