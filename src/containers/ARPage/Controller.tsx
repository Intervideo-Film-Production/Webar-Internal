import React from "react";
import { Grid, Fade, IconButton, Collapse } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
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

interface ARPageControllerProps {
  showControl: boolean;
  onShowControl?: (shouldControlDisplay: boolean) => any;
  showGrandControl?: boolean;
  onInfo?: Function;
  onRecenter?: Function;
  onReview?: Function;
  onCompare?: Function;
}

const useStyles = makeStyles(() =>
  createStyles({
    topRadius: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    zIndex: {
      zIndex: 9,
    },
  })
);

const ARPageController = (props: ARPageControllerProps) => {
  const {
    showControl,
    onShowControl,
    showGrandControl,
    onInfo,
    onRecenter,
    onReview,
    onCompare,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const { productClaimToggleEvent, appLoadingStateEvent } = useAppContext();
  const history = useHistory();
  const queryClient = useQueryClient();

  const controlHandle = (shouldControlDisplay: boolean) => {
    if (onShowControl) {
      onShowControl(shouldControlDisplay);
    }
  };

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

          <IconButton
            sx={{ p: 0, zIndex: 2 }}
            onClick={() => reCenterButtonHandle()}
          >
            <ReCenterIcon sx={{ fontSize: 42 }} />
          </IconButton>

          <Grid
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            {/* <AppButton
              className={classes.topRadius}
              sx={{
                width: 90,
                height: 48,
                marginBottom: "4%",
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#fff",
                },
              }}
              onClick={() => controlHandle(true)}
            >
            </AppButton> */}

            <AppButton
                sx={(theme) => ({
                  backgroundColor: "transparent",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  borderRadius: 0,
                  whiteSpace: "pre-wrap",
                  width: 65,
                  height: 70,
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
          </Grid>
        </Grid>

        <Collapse in={showControl} classes={{ wrapperInner: classes.zIndex }}>
          <Grid
            className={classes.topRadius}
            sx={{
              bgcolor: "#fff",
            }}
          >
            <Fade in={showControl}>
              <AppGrid
                sx={{
                  gridTemplateColumns: "1fr auto 1fr",
                  p: "24px",
                }}
              >
                <Grid>
                  <IconButton
                    sx={{
                      transform: "translateY(-20px)",
                    }}
                    onClick={() => {
                      controlHandle(false);
                    }}
                  >
                    <AppArrowUpIcon
                      sx={(theme) => ({
                        ...theme.arPageStyles?.pageController.toggleArrowDown,
                      })}
                    />
                  </IconButton>
                </Grid>
                <AppGrid
                  sx={{
                    rowGap: "10px",
                  }}
                >
                  <AppButton
                    fullWidth
                    variant="contained"
                    sx={(theme) => theme.arPageStyles?.pageController.button}
                    onClick={() => reviewButtonHandle()}
                  >
                    {t("ArPageReviewsButtonText")}
                  </AppButton>
                  <AppButton
                    fullWidth
                    variant="contained"
                    sx={(theme) => theme.arPageStyles?.pageController.button}
                    onClick={() => compareButtonHandle()}
                  >
                    {t("ArPageCompareButtonText")}
                  </AppButton>
                </AppGrid>
              </AppGrid>
            </Fade>
          </Grid>
        </Collapse>
      </Grid>
    </Collapse>
  );
};

export default ARPageController;
