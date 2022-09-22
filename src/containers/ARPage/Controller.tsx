import React, { useMemo } from "react";
import { Grid, IconButton, Collapse, Typography, Rating, Button } from "@mui/material";
import {
  ProductInfoIcon,
  ReCenterIcon,
  AppCameraSquareIcon,
} from "src/components/icons";
import { useTranslation } from "react-i18next";
import { AppButton } from "src/components";
import { useAppContext } from "src/core/store";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { QueryKeys } from "src/core/declarations/enum";
import { useLocation } from "react-router-dom";
import { IProduct } from "src/core/declarations/app";
import { useReactQueryData } from "src/hooks";

interface ARPageControllerProps {
  showGrandControl?: boolean;
  onInfo?: Function;
  onRecenter?: Function;
  onReview?: Function;
}

const ARPageController = (props: ARPageControllerProps) => {
  const {
    // onShowControl,
    showGrandControl,
    onInfo,
    onRecenter,
    onReview,
  } = props;
  const { t } = useTranslation();
  const { appLoadingStateEvent } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  console.log(showGrandControl);

  // FIXME check location state should be default
  const location = useLocation();
  
  const productData = useReactQueryData<IProduct>(QueryKeys.product);

  const averageRatings = useMemo(() => {
    if (!productData || productData.ratings.length === 0) return null;
    const _averageRatings = productData.ratings.reduce((a: number, b: number) => a + b, 0) / productData.ratings.length;
    return Math.floor(_averageRatings * 100) / 100;
  }, [productData])

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
    navigate("/scan-page");
  };

  const reviewButtonHandle = () => {
    if (onReview) {
      onReview();
    }
  };

  return (
    <Collapse in={showGrandControl}>
      <Grid
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
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
              p: 0,
              backgroundColor: "rgba(0,0,0, .3)",
              borderRadius: '12px',
              whiteSpace: "pre-wrap",
              minWidth: '51px',
              width: "51px",
              height: "51px",
              textAlign: "center",
              justifyContent: 'center',
              position: "relative",
              fontSize: "10px",
              ...theme.arPageStyles.pageController.scanOtherProductBox,
              '& .MuiSvgIcon-root': {
                stroke: theme.palette.text.primary
              }
            })}
            onClick={() => scanButtonHandle()}
            startIcon={
              <AppCameraSquareIcon
                sx={{
                  position: "absolute",
                  width: "51px",
                  height: "51px",
                  top: 0,
                  strokeWidth: 10
                }}
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
          <Grid
            sx={{
              display: 'flex',
              justifyContent: "space-between",
              alignItems: 'center',
              p: "20px",
            }}
          >
            {/* product name */}
            <Typography variant="h6" sx={{
              lineHeight: 1,
              color: theme => theme.palette.text.secondary,
              fontWeight: 700
            }}>{productData?.name}</Typography>

            <Button sx={{
              padding: "5px 10px",
              background: "#eaeaea",
              minWidth: '140px',
              borderRadius: "17px",
              display: 'flex',
              boxShadow: theme => theme.shadows[2],
              '&:hover': {
                background: "#eaeaea"
              }
            }}
              onClick={reviewButtonHandle}>
              <Rating name="product-rating" value={averageRatings} precision={0.1} readOnly size="medium" />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Collapse>
  );
};

export default ARPageController;
