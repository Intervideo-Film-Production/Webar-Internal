// FIXME temporary use the previous version with QR code scanning only
// this current version includes image targets will be tackled after the holiday

import { Box, Toolbar } from "@mui/material";
import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppGrid, LoadingBox } from "src/components";
import {
  qrdisplayPipelineModule,
  qrprocessPipelineModule,
} from "./qrprocessPipelineModule";
import { Subject, filter, throttle, interval } from "rxjs";
import { useAppContext } from "src/core/events";
import { StoreStatus } from "src/core/declarations/enum";
import { useBoundStore } from "src/core/store";
import { AframeComponent, AFrameScene } from "src/A-Frame/aframeScene";
import qrScanPage from 'src/A-Frame/views/qr-scan.view.html';
import CameraSquareWrapper from "./CameraSquare";
import { useTranslation } from "react-i18next";
import BackgroundMask from "./BackgroundMask";
import useProductQRValue from "./useProductQRValue";
import ScanPageDetails from "./ScanPageDetails";

declare let XR8: any;
declare let XRExtras: any;
interface ICompopentGenerator {
  (
    onQrScan: (productText: string) => void,
    imageTargets: string[] | null,
    showImageTarget: ({ detail: { name } }: { detail: { name: string } }) => void,
  ): Array<AframeComponent>;
};

const components: ICompopentGenerator =
  (onQrScan, imageTargets, showImageTarget) => {
    return [{
      name: "initializer",
      val: {
        init: function () {
          let scene = this.el.sceneEl;
          XR8.addCameraPipelineModules([
            // Add camera pipeline modules.
            // Existing pipeline modules.
            XR8.CameraPixelArray.pipelineModule({
              luminance: true,
              maxDimension: 640,
            }),
            XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
            XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
            qrprocessPipelineModule(),
            qrdisplayPipelineModule(scene.canvas, onQrScan),
            {
              name: "request-gyro",
              requiredPermissions: () => [
                XR8.XrPermissions.permissions().DEVICE_ORIENTATION,
              ],
            },

          ]);

          if (!!imageTargets && imageTargets.length > 0) {
            XR8.XrController.configure({ imageTargets });
            this.el.sceneEl.addEventListener(
              "xrimagefound",
              showImageTarget as (e: unknown) => void
            );
          }
        },
        remove: function () {

          XR8.clearCameraPipelineModules();
          XR8.XrController.configure({ imageTargets: ["case"] });
          this.el.sceneEl.removeEventListener(
            "xrimagefound",
            showImageTarget as (e: unknown) => void
          );
          XR8.stop();
        }
      }
    }];
  }

const ScanPage = () => {
  const { appLoadingStateEvent } = useAppContext();
  const navigate = useNavigate();

  const { i18n } = useTranslation();
  const storeData = useBoundStore(state => state.store);

  const onCameraUpdateEvent = useRef(new Subject<string>());

  const [productQrText, setProductQrText] = useState("");

  const storeId = useBoundStore(state => state.store?.id);
  const { product, getByQR } = useBoundStore(({ product, productStatus, getByQR }) => ({ product, productStatus, getByQR }));
  const { imageTargetCodes, imageTargetCodesStatus, setImageTargetCodes } = useBoundStore(({ imageTargetCodes, imageTargetCodesStatus, setImageTargetCodes }) => ({
    imageTargetCodes,
    imageTargetCodesStatus,
    setImageTargetCodes
  }))

  useEffect(() => {
    if (!!storeId) setImageTargetCodes(storeId);

  }, [setImageTargetCodes, storeId]);

  useEffect(() => {
    // disable app loading page
    if (appLoadingStateEvent && appLoadingStateEvent.getValue() === true) {
      appLoadingStateEvent.next(false);
    }
  });

  useEffect(() => {
    /**
     * if product data successfully returned from server
     * navigate to AR page
     */
    if (product && navigate) {
      navigate("/ar-page");
    }
  }, [product, navigate]);

  useEffect(() => {
    if (!!productQrText && !!storeData?.id) {
      getByQR(productQrText, i18n.language, storeData?.id);
    }
  }, [productQrText, getByQR, i18n.language, storeData]);

  useEffect(() => {
    if (onCameraUpdateEvent.current) {
      const cameraUpdateEvent = onCameraUpdateEvent.current;
      const subscription = cameraUpdateEvent
        .pipe(
          // filter all empty values
          filter((v) => !!v),
          // take value once every half second
          throttle(() => interval(150))
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

  const qrScanHandler = useCallback((productText: string) => {
    onCameraUpdateEvent.current.next(productText || "");
  }, []);

  const showImage = useCallback(({ detail }: { detail: { name: string } }) => {
    onCameraUpdateEvent.current.next(detail.name || "");
  }, []);

  const registerComponents = useMemo(() => {
    return components(qrScanHandler, imageTargetCodes, showImage)
  }, [qrScanHandler, imageTargetCodes, showImage])

  const { isFetching, isError, productName } = useProductQRValue(onCameraUpdateEvent.current);

  useEffect(() => {
    if (!!productName) {
      navigate("/ar-page");
    }
  }, [productName, navigate])

  if (imageTargetCodesStatus === StoreStatus.loading) {
    return (<LoadingBox />)
  }

  return (
    <>
      {/* qr code scanner aframe */}
      <Box
        id="scanPageWrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: window.innerHeight,
          width: window.innerWidth
        }}>
        <AFrameScene sceneHtml={qrScanPage} components={registerComponents} wrapperId="scanPageWrapper" />
      </Box>

      {/* content */}
      <AppGrid
        sx={{
          gridTemplateRows: "auto 1fr auto",
          zIndex: 2,
          position: "relative",
        }}
      >
        <Toolbar />

        {/* gray mask just for decoration only */}
        <BackgroundMask maskImage="imgs/rect.svg" />
        <BackgroundMask maskImage="imgs/rect_contrast.svg" backgroundColor="rgba(255,255,255,.4)" />

        {/* responsive camera square */}
        <CameraSquareWrapper />

        {/* qr code scan results and prefined list of items */}
        <ScanPageDetails
          isFetching={isFetching}
          isError={isError}
          itemName={productName}
        />
      </AppGrid >
    </>)
};

export default ScanPage;
