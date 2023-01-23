import React, { useCallback, useMemo } from "react";
import { Grid, IconButton, Collapse, Typography, Rating, Button } from "@mui/material";
import {
  ProductInfoIcon,
  ReCenterIcon,
  AppCameraSquareIcon,
} from "src/components/icons";
import { useTranslation } from "react-i18next";
import { AppButton } from "src/components";
import { useNavigate } from "react-router-dom";
import { IProductColor } from "src/core/declarations/app";
import ColorPicker from "./ColorPicker";
import { Subject } from "rxjs";
import { useBoundStore } from "src/core/store";
import { useAppContext } from "src/core/events";

interface ARPageControllerProps {
  showGrandControl?: boolean;
  onInfo?: Function;
  onRecenter?: Function;
  onReview?: Function;
  productColorSub?: Subject<IProductColor>;
}

const ARPageController = (props: ARPageControllerProps) => {
  const {
    // onShowControl,
    showGrandControl,
    onInfo,
    onRecenter,
    onReview,
    productColorSub
  } = props;
  const { t } = useTranslation();
  const { appLoadingStateEvent } = useAppContext();
  const navigate = useNavigate();
  const product = useBoundStore(state => state.product);
  const resetData = useBoundStore(state => state.resetData);

  const averageRatings = useMemo(() => {
    if (!product || product.ratings.length === 0) return null;
    const _averageRatings = product.ratings.reduce((a: number, b: number) => a + b, 0) / product.ratings.length;
    return Math.floor(_averageRatings * 100) / 100;
  }, [product])

  const handleSelectColor = useCallback((color: IProductColor) => {
    if (!!productColorSub) productColorSub.next(color);
  }, [productColorSub]);

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
    resetData();
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
          <Grid sx={{ position: 'relative' }}>
            {product?.arObjectColors && (<ColorPicker onSelectColor={handleSelectColor} />)}

            <IconButton
              sx={{ p: 0, zIndex: 2 }}
              onClick={() => infoButtonHandle()}
            >
              <ProductInfoIcon sx={{ fontSize: 42 }} />
            </IconButton>
          </Grid>

          <AppButton
            sx={(theme) => ({
              p: 0,
              backgroundColor: "rgba(0,0,0, .3)",
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
            startIcon={<img
              style={{
                width: '51px',
                height: '51px',
                position: 'absolute'
              }}
              src='./imgs/QR_Quad.png'
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
            }}>{product?.name}</Typography>

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
