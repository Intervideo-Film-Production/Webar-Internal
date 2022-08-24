import React from "react";
import { Grid, IconButton, Collapse, Typography } from "@mui/material";
import {
  ProductInfoIcon,
  ReCenterIcon,
  AppArrowUpIcon,
  AppCameraSquareIcon,
} from "src/components/icons";
import { useTranslation } from "react-i18next";
import { AppGrid, AppButton } from "src/components";
import { useAppContext } from "src/core/store";
import { useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";
import { QueryKeys } from "src/core/declarations/enum";
import { useLocation } from "react-router-dom";
import { IProduct } from "src/core/declarations/app";

interface ARPageControllerProps {
  // onShowControl?: (shouldControlDisplay: boolean) => any;
  showGrandControl?: boolean;
  onInfo?: Function;
  onRecenter?: Function;
  onReview?: Function;
  onCompare?: Function;
}

const ARPageController = (props: ARPageControllerProps) => {
  const {
    // onShowControl,
    showGrandControl,
    onInfo,
    onRecenter,
    onReview,
    onCompare,
  } = props;
  const { t } = useTranslation();
  const { productClaimToggleEvent, appLoadingStateEvent } = useAppContext();
  const history = useHistory();
  const queryClient = useQueryClient();

  // FIXME check location state should be default
  const location = useLocation<{ productId: string }>();
  const productId = location.state.productId;

  const productData = !!productId
    ? queryClient.getQueryData<IProduct>([QueryKeys.product, productId]) as IProduct
    : queryClient.getQueryData<IProduct>(QueryKeys.product) as IProduct;

  // FIXME
  // const controlHandle = (shouldControlDisplay: boolean) => {
  //   if (onShowControl) {
  //     onShowControl(shouldControlDisplay);
  //   }
  // };

  const infoButtonHandle = () => {
    if (onInfo) {
      onInfo();
    }
  };

  const reCenterButtonHandle = () => {
    if (onRecenter) {
      onRecenter();
    }
  };

  const scanButtonHandle = () => {
    queryClient.removeQueries(QueryKeys.product, { exact: true });
    queryClient.removeQueries(QueryKeys.compareProduct, { exact: true });
    queryClient.removeQueries(QueryKeys.productComments, { exact: true });
    queryClient.removeQueries(QueryKeys.compareProducts, { exact: true });
    queryClient.removeQueries(QueryKeys.buttonAnimationContent, {
      exact: true,
    });
    queryClient.removeQueries(QueryKeys.productfinder, { exact: true });
    queryClient.removeQueries(QueryKeys.imageTargetsCodes, { exact: true });
    appLoadingStateEvent.next(true);
    history.push("/scan-page");
  };

  const reviewButtonHandle = () => {
    if (onReview) {
      onReview();
    }
  };

  const compareButtonHandle = () => {
    if (onCompare) onCompare();
    if (productClaimToggleEvent) productClaimToggleEvent.next(false);
  };

  return (
    <Collapse in={showGrandControl}>
      <Grid
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          marginBottom: "20px",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: "0px 20px 10px",
          }}
        >
          <IconButton
            sx={{ p: 0, zIndex: 2 }}
            onClick={() => infoButtonHandle()}
          >
            <ProductInfoIcon sx={{ fontSize: 42 }} />
          </IconButton>

          <AppButton
            sx={(theme) => ({
              backgroundColor: "transparent",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              borderRadius: 0,
              whiteSpace: "pre-wrap",
              width: '53px',
              height: '53px',
              textAlign: "center",
              position: "relative",
              fontSize: "10px",
              ...theme.arPageStyles.pageController.scanOtherProductBox,
            })}
            onClick={() => scanButtonHandle()}
            startIcon={
              <AppCameraSquareIcon
                sx={(theme) => ({
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                })}
              />
            }
          >
            {t("ArPageScanOtherProductButtonText")}
          </AppButton>

          <IconButton
            sx={{ p: 0, zIndex: 2 }}
            onClick={() => reCenterButtonHandle()}
          >
            <ReCenterIcon sx={{ fontSize: 42 }} />
          </IconButton>
        </Grid>

        <Grid
          sx={{
            bgcolor: "#fff",
          }}
        >
          <AppGrid
            sx={{
              gridTemplateColumns: "1fr 1fr",
              p: "24px",
            }}
          >
            <Typography>{productData?.name}</Typography>
            {/* TODO 3d ar name */}

            {/* TODO stars & show review button */}
          </AppGrid>
        </Grid>
      </Grid>
    </Collapse>
  );
};

export default ARPageController;
