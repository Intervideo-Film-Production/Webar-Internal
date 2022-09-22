// FIXME temporary use the previous version with QR code scanning only
// this current version includes image targets will be tackled after the holiday

import { Box, Toolbar } from "@mui/material";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppGrid, LoadingBox } from "src/components";
import {
  qrdisplayPipelineModule,
  qrprocessPipelineModule,
} from "./qrprocessPipelineModule";
import { useQuery } from "react-query";
import { QueryKeys } from "src/core/declarations/enum";
import { getFirstProductQRCodes } from "src/crud/crud";
import { Subject } from "rxjs";
import { IQRCodeData } from "src/core/declarations/app";
import { AframeComponent, AFrameScene } from "src/A-Frame/aframeScene";
import qrScanPage from '../../views/qr-scan.view.html';
import BackgroundMask from "./BackgroundMask";
import CameraSquareWrapper from "./CameraSquare";
import ScanPageDetails from "./ScanPageDetails";
import useProductQRValue from "./useProductQRValue";
import { useReactQueryData } from "src/hooks";

declare let XR8: any;
declare let XRExtras: any;
interface ICompopentGenerator {
  (
    onQrScan: (productText: string) => void,
    imageTargets: string[] | undefined,
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
  const navigate = useNavigate();

  const qrCodeData = useReactQueryData<IQRCodeData>(QueryKeys.qrCode)
  const onCameraUpdateEvent = useRef(new Subject<string>());

  const { isFetched: imageTargetsFetched, data: imageTargetData } = useQuery(QueryKeys.imageTargetsCodes, () =>
    getFirstProductQRCodes(qrCodeData?.id as string)
      // FIXME: temporary fix => should adjust api instead
      .then((qrCodes) => qrCodes.slice(0, 5))
  );

  const qrScanHandler = useCallback((productText: string) => {
    onCameraUpdateEvent.current.next(productText || "");
  }, []);

  const showImage = useCallback(({ detail }: { detail: { name: string } }) => {
    onCameraUpdateEvent.current.next(detail.name || "");
  }, []);

  // FIXME test model only
  // useEffect(() => {
  //   setTimeout(() => {
  //     onCameraUpdateEvent.current.next("KTM");
  //   }, 5000)
  // }, [])

  const registerComponents = useMemo(() => {
    return components(qrScanHandler, imageTargetData, showImage)
  }, [qrScanHandler, imageTargetData, showImage])

  const { isFetching, isError, productName } = useProductQRValue(onCameraUpdateEvent.current);

  useEffect(() => {
    if (!!productName) {
      navigate("/ar-page");
    }
  }, [productName, navigate])

  if (!imageTargetsFetched) {
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
        <BackgroundMask />

        {/* responsive camera square */}
        <CameraSquareWrapper cameraQRCodeEvent={onCameraUpdateEvent.current} />

        {/* qr code scan results and prefined list of items */}
        <ScanPageDetails
          isFetching={isFetching}
          isError={isError}
          itemName={productName}
        />
      </AppGrid>
    </>
  );
};

export default ScanPage;
