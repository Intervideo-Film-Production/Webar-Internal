import React, { memo, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

interface IPermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onPermissionGranted: () => void;
};

const PermissionsDialog = memo((props: IPermissionDialogProps) => {
  const { open, onClose, onPermissionGranted } = props;
  const { t } = useTranslation();

  const handleClose = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  const handlePermission = useCallback(() => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: 'granted' | 'denied') => {
          if (permissionState === 'granted') {
            onPermissionGranted && onPermissionGranted();
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
    }

    handleClose();
  }, [onPermissionGranted, handleClose]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="request-motion-permission"
      >
        <DialogTitle id="request-motion-permission">
          {t("MotionPermissionAskText")}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>{t("MotionPermissionDenyText")}</Button>
          <Button onClick={handlePermission}>{t("MotionPermissionAllowText")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default PermissionsDialog;
