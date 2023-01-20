import { Grid, Typography } from '@mui/material';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const CameraSquare = memo(() => {
  return (
    <img style={{ width: '265px', height: '265px' }} src='/imgs/QR_Quad.png' />
  )
})

const CameraSquareWrapper: React.FC = memo(() => {
  const { t } = useTranslation();

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

        <CameraSquare />
      </Grid>
    </Grid>
  )
})

export default CameraSquareWrapper;
