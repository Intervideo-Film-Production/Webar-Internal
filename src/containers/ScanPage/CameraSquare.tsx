import { Grid, Typography } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { map, Observable } from 'rxjs';
import { useAppContext } from 'src/core/events';

interface CameraSquareProps {
  found: boolean;
  color: string;
  foundColor: string;
  cameraUpdateEvent?: Observable<boolean>;
}

const CameraSquare = memo(({ found, color, foundColor, ...props }: CameraSquareProps & React.SVGAttributes<SVGSVGElement>) => {

  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="265" height="265" viewBox="0 0 265 265">
      <g id="camera-square" transform="translate(2.5 2.5)" opacity="0.8">
        <path id="Path_1" d="M479.732,425.721h-31.5a50.909,50.909,0,0,1-50.909-50.91v-31.5" transform="translate(-397.326 -165.721)" fill="none" stroke={found ? foundColor : color} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="5" />
        <path id="Path_2" d="M671.834,343.314v31.5a50.91,50.91,0,0,1-50.91,50.91h-31.5" transform="translate(-411.834 -165.721)" fill="none" stroke={found ? foundColor : color} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="5" />
        <path id="Path_3" d="M589.427,151.213h31.5a50.91,50.91,0,0,1,50.91,50.909v31.5" transform="translate(-411.834 -151.213)" fill="none" stroke={found ? foundColor : color} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="5" />
        <path id="Path_4" d="M397.326,233.619v-31.5a50.909,50.909,0,0,1,50.909-50.909h31.5" transform="translate(-397.326 -151.213)" fill="none" stroke={found ? foundColor : color} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="5" />
      </g>
    </svg>
  )
})

interface ICameraSquareWrapperProps {
  cameraQRCodeEvent: Observable<string>;
}

const CameraSquareWrapper: React.FC<ICameraSquareWrapperProps> = memo(({ cameraQRCodeEvent }) => {
  const { appTheme } = useAppContext();
  const { t } = useTranslation();
  const [found, setFound] = useState(false);

  useEffect(() => {
    if (cameraQRCodeEvent) {
      const subscription = cameraQRCodeEvent.pipe(
        map((v) => v !== "")
      ).subscribe(isFound => {
        setFound(isFound);
      })

      return () => { subscription.unsubscribe(); }
    }
  }, [cameraQRCodeEvent])

  return (
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
          found={found}
          color={appTheme.getValue().scanPageStyles.color}
          foundColor={appTheme.getValue().scanPageStyles.foundColor}
          style={{ width: "202px", height: "202px" }}
        />
      </Grid>
    </Grid>
  )
})

export default CameraSquareWrapper;
