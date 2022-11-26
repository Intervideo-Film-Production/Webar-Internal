// FIXME temporary use the previous version with QR code scanning only
// this current version includes image targets will be tackled after the holiday

import { Grid, Typography, Box, Toolbar } from "@mui/material";
import { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { AppButton, AppGrid } from "src/components";
import {
  qrdisplayPipelineModule,
  qrprocessPipelineModule,
} from "./qrprocessPipelineModule";
import CameraSquare from "./CameraSquare";
import { useQuery, useQueryClient } from "react-query";
import { QueryKeys } from "src/core/declarations/enum";
import { getProduct, getFirstProductQRCodes } from "src/crud/crud";
import { map, Subject, filter, throttle, interval } from "rxjs";
import parse from "html-react-parser";
import { IQRCodeData } from "src/core/declarations/app";
import { useAppContext } from "src/core/events";
import ScanPageProductList from "./ScanPageProductList";

declare let XR8: any;
declare let XRExtras: any;

// NOTE: for development only
const script8thWallDisabled = false; // process.env.REACT_APP_8THWALL_DISABLED

// FIXME should check UX for button press behavior
const ScanPage = () => {
  const { appTheme, appLoadingStateEvent } = useAppContext();

  const { t, i18n } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();
  const qrCodeData = queryClient.getQueryData<IQRCodeData>(QueryKeys.qrCode);

  const onCameraUpdateEvent = useRef(new Subject<any>());
  const productFinderButton = useRef<HTMLButtonElement | null>(null);

  const [productQrText, setProductQrText] = useState("");

  const imageTargets = useQuery(QueryKeys.imageTargetsCodes, () =>
    getFirstProductQRCodes(qrCodeData?.id as string)
      // FIXME: temporary fix => should adjust api instead
      .then((qrCodes) => qrCodes.slice(0, 5))
  );

  const { isFetching, refetch, data, isError } = useQuery(
    QueryKeys.product,
    () => getProduct(productQrText, i18n.language, qrCodeData?.id as string),
    {
      enabled: false,
      cacheTime: Infinity,
    }
  );

  useEffect(() => {
    // disable app loading page
    if (appLoadingStateEvent && appLoadingStateEvent.getValue() === true) {
      appLoadingStateEvent.next(false);
    }
  });

  const scene = useMemo(() => {
    return script8thWallDisabled
      ? null
      : parse(`
  <a-scene
    id="a-scene"
    xrextras-generate-image-targets
    xrweb>
      <a-camera position="0 0 0"></a-camera>
  </a-scene>`);
  }, []);

  useEffect(() => {
    /**
     * if product data successfully returned from server
     * navigate to AR page
     */
    if (data && history) {
      history.push("/ar-page");
    }
  }, [data, history]);

  useEffect(() => {
    if (!!productQrText) {
      refetch();
    }
  }, [productQrText, refetch]);

  useEffect(() => {
    if (onCameraUpdateEvent.current) {
      const cameraUpdateEvent = onCameraUpdateEvent.current;
      const subscription = cameraUpdateEvent
        .pipe(
          // filter all empty values
          filter((v) => !!v),
          // take value once every half second
          throttle((val) => interval(150))
        )
        .subscribe((foundProductQrText) => {
          if (productQrText !== foundProductQrText) {
            // found another text set new product Qr text
            setProductQrText(foundProductQrText);
          }
        });

      return () => {
        subscription.unsubscribe();
      };
    }
  });

  useEffect(() => {
    const canvasEl = script8thWallDisabled
      ? null
      : (document.querySelector("a-scene#a-scene canvas") as HTMLCanvasElement);
    if (canvasEl) {
      const onQrScan = (found: boolean, productText: string) => {
        onCameraUpdateEvent.current.next(productText || "");
      };

      XR8.XrController.configure({ disableWorldTracking: true });

      //QR scanning
      XR8.addCameraPipelineModules([
        // Add camera pipeline modules.
        // Existing pipeline modules.
        XR8.CameraPixelArray.pipelineModule({
          luminance: true,
          maxDimension: 640,
        }), // Provides pixels.
        // XR8.GlTextureRenderer.pipelineModule(),  // Draws the camera feed.
        // XRExtras.AlmostThere.pipelineModule(),  // Detects unsupported browsers and gives hints.
        // XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
        XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
        XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
        qrprocessPipelineModule(),
        qrdisplayPipelineModule(canvasEl, onQrScan),
        {
          name: "request-gyro",
          requiredPermissions: () => [
            XR8.XrPermissions.permissions().DEVICE_ORIENTATION,
          ],
        },
      ]);

      // Request camera permissions and run the camera.

      // --------------------------------------------------------------------------------

      return () => {
        XR8.clearCameraPipelineModules();
        XR8.stop();
        document.getElementById("camerafeed")?.remove();
        document.getElementById("overlay2d")?.remove();
        XR8.XrController.configure({ imageTargets: ["case"] });
        document.getElementById("overlayText")?.remove();
        document.getElementById("a-scene")?.remove();
      };
    }
  }, []);

  useEffect(() => {
    const imageTargetsText = imageTargets.data;
    const aframeScene = document.getElementById("a-scene");

    if (imageTargetsText && imageTargetsText.length > 0 && aframeScene) {
      // image targets -----------------------------------------------------------------
      //create an empty A-frame scene to dispatch image target events

      //add image targets to controller
      if (!script8thWallDisabled) {
        XR8.XrController.configure({ imageTargets: imageTargetsText });
      }

      const showImage = ({ detail }: { detail: { name: string } }) => {
        onCameraUpdateEvent.current.next(detail.name || "");
      };

      if (aframeScene) {
        aframeScene.addEventListener(
          "xrimagefound",
          showImage as (e: unknown) => void
        );

        return () =>
          aframeScene.removeEventListener(
            "xrimagefound",
            showImage as (e: unknown) => void
          );
      }
    }
  }, [imageTargets.data]);

  return (
    <>
      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: window.innerHeight,
          width: window.innerWidth,
        }}
      >
        {scene}
      </Box>

      <AppGrid
        sx={{
          gridTemplateRows: "auto 1fr auto",
          zIndex: 2,
          position: "relative",
        }}
      >
        <Toolbar />

        <Grid
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background: "rgba(0,0,0,.3)",
            maskImage: `url("imgs/rect.svg")`,
            maskRepeat: "no-repeat",
            maskPosition: "center top",
            maskSize: "1000px 1000px",
            zIndex: 3,
          }}
        ></Grid>

        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 4,
          }}
        >
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: "130px",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={(theme) => theme.scanPageStyles.qrBoxText}
            >
              {t("ScanPageScanQRCode")}
            </Typography>

            <CameraSquare
              color={appTheme.getValue().scanPageStyles.color}
              foundColor={appTheme.getValue().scanPageStyles.foundColor}
              style={{ width: "202px", height: "202px" }}
              cameraUpdateEvent={onCameraUpdateEvent.current.pipe(
                map((v) => v !== "")
              )}
            />
          </Grid>
        </Grid>

        <Grid
          sx={{
            textAlign: "center",
            marginBottom: 7,
            marginTop: 3,
            position: "absolute",
            bottom: 0,
            width: "100%",
            zIndex: 5,
          }}
        >
          <Typography
            variant="h5"
            sx={(theme) => theme.scanPageStyles.resultText}
          >
            {isFetching && t("ScanPageFetchText")}
            {!isFetching &&
              (isError || data === null) &&
              t("ScanPageQRCodeNotCorrectText")}
            {data && (
              <>
                {t("ScanPageFoundProductText")}
                <span id="scanPageFoundProduct">{data.name}</span>
              </>
            )}
          </Typography>

          {/* <Grid sx={{
            display: !!data ? 'none' : 'block'
          }}>
            <Typography sx={{ opacity: 0.7, mb: 2 }} variant="h3">
              {t("ScanPageDirectSelectionText")}
            </Typography>

            <ScanPageProductList />
          </Grid> */}
          <AppButton
            onClick={() => { history.push('/product-finder') }}
            ref={productFinderButton}
            variant="contained"
            sx={theme => ({
              whiteSpace: 'pre-wrap',
              ...theme.scanPageStyles.productFinderButton
            })}
          >{t("ScanPageHelperButtonText")}</AppButton>
        </Grid>
      </AppGrid>
    </>
  );
};

export default ScanPage;
