import React, { forwardRef, ForwardedRef } from "react";
import {
  Grid,
  GridTypeMap,
  Toolbar,
  Box,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { AppGrid, LazyImage } from "src/components";
import { IProduct } from "src/core/declarations/app";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";
import { useBoundStore } from "src/core/store";

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  [`& .${linearProgressClasses.bar}`]: {
    ...theme.arPageStyles?.loadingScreen?.progressLoadingBar,
  },
}));

const LoadingScreen = forwardRef(
  (
    {
      ...props
    }: DefaultComponentProps<GridTypeMap>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const product = useBoundStore(state => state.product);
    if (!product) return <>Data not available</>;

    return (
      <AppGrid
        ref={ref}
        {...props}
        sx={(theme: any) => ({
          gridTemplateRows: "auto auto 1fr",
          flexGrow: 1,
          position: "fixed",
          pb: 1,
          left: 0,
          right: 0,
          top: 0,
          zIndex: 900,
          ...theme.arPageStyles?.loadingScreen.root,
        })}
      >
        <Toolbar />
        <Box>
          <CustomLinearProgress />
        </Box>
        <Grid
          sx={{
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
          }}
        >
        </Grid>

        <LazyImage
          src={product.image}
          alt={product.imageCaption}
          styles={{
            objectPosition: "center",
            position: "fixed",
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            objectFit: "contain",
            background: "#f7f7f7",
            height: "100%",
            width: "100%",
            marginLeft: "0vh",
          }}
        />
      </AppGrid>
    );
  }
);

export default LoadingScreen;
