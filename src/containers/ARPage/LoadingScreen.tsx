import { forwardRef, ForwardedRef } from "react";
import {
  Grid,
  GridTypeMap,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { AppGrid, LazyImage } from "src/components";
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
          gridTemplateRows: "auto auto 1fr 1fr 1fr",
          flexGrow: 1,
          position: "fixed",
          pb: 1,
          left: 0,
          backgroundColor: '#fff',
          right: 0,
          top: 0,
          height: '100%',
          zIndex: 900,
          ...theme.arPageStyles?.loadingScreen.root,
        })}
      >
        <Toolbar />
        <Box>
          <CustomLinearProgress />
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography variant="h3" fontWeight={400} color={"#152436"}>{product.name}</Typography>
          {product.displayProductClaim && (
            <Typography variant="h6" fontWeight={400} color={"#152436"}>{product.productClaim}</Typography>
          )}
        </Box>

        <Box>
          <LazyImage
            src={product.image}
            alt={product.imageCaption}
            styles={{
              objectPosition: "center",
              zIndex: -1,
              objectFit: "contain",
              background: '#fff',
              // background: "#f7f7f7",
              // height: "100%",
              // width: "100%",
              marginLeft: "0vh",
            }}
          />
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            color: '#000',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img src="./icons/zoom_in.png" alt="zoom in" />
            <span>ZOOM IN</span>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            color: '#000',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img src="./icons/zoom_out.png" alt="zoom out" />
            <span>ZOOM OUT</span>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            color: '#000',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img src="./icons/rotate_finger.png" alt="rotate" />
            <span>ROTATE</span>
          </Box>
        </Box>
      </AppGrid>
    );
  }
);

export default LoadingScreen;
