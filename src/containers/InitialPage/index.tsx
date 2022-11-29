import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useLocation
} from 'react-router-dom';
import queryString from 'query-string';
import { useAppContext } from 'src/core/events';
import { Redirect } from 'react-router-dom';
import { LoadingBox } from 'src/components';
import { getDataExportDate } from 'src/crud/crud.local';
import PermissionsDialog from './PermissionDialog';
import { isIOS } from 'src/core/helpers';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useLanguage } from 'src/core/i18n';
import { useBoundStore } from 'src/core/store';
import { StoreStatus } from 'src/core/declarations/enum';

// FIXME should check iOS in allow scan page
const iOS = isIOS();

const useStyles = makeStyles(() => ({
  splashScreen: {
    position: 'fixed',
    bottom: '.5rem',
    left: '.5rem',
    right: '.5rem',
    display: 'flex',
    justifyContent: 'center'
  },
  splashScreenImg: {
    width: '50vw'
  }
}));

const InitialPage = () => {
  const classes = useStyles();
  const [permissionStatus, setPermissionStatus] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { initialPageUrl } = useAppContext();
  const { language, languagesStatus, loadLanguage } = useLanguage();
  const { setStore, store, storeStatus } = useBoundStore(({ setStore, store, storeStatus }) => ({ setStore, store, storeStatus: storeStatus }));
  const { product, productStatus, getByQR } = useBoundStore(({ product, productStatus, getByQR }) => ({ product, productStatus, getByQR }));
  const location = useLocation();

  let { sid, productqr } = queryString.parse(location.search) as { sid: string | null, productqr: string | null };
  const loading = useMemo(() => storeStatus !== StoreStatus.loaded || (productqr && productStatus !== StoreStatus.loaded), [storeStatus, productqr, productStatus]);
  if (!sid) {
    let storedSid = localStorage.getItem("storeID");
    if (!!storedSid) sid = storedSid;
  } else {
    localStorage.setItem("storeID", sid);
  }

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, [])

  const handlePermissionStatus = useCallback(() => {
    setPermissionStatus(true)
  }, [])

  useEffect(() => {
    if (process.env.REACT_APP_STATIC_DATA === 'TRUE') {
      getDataExportDate().then(dateVersion => {
        console.log(`
  ===================================
    ${!dateVersion
            ? `Unidentified local data version, please update with latest data version from Sanity Studio`
            : `Local data exported from ${dateVersion}`} 
  ===================================
            `)
      })
    }
  }, [])

  // FIXME should handle productqr as well
  useEffect(() => {
    if (initialPageUrl && sid) {

      initialPageUrl.next(`${document.location.href}?sid=${sid}`);
    }
  }, [initialPageUrl, sid, location])

  // get store data
  useEffect(() => {
    if (!!sid) setStore(sid);
  }, [sid, setStore])

  useEffect(() => {
    if (!!productqr && language && store?.id) getByQR(productqr, language, store.id);
  }, [store, language, productqr, getByQR])

  useEffect(() => {
    if (languagesStatus === StoreStatus.loaded && store?.brandId && !language) {
      loadLanguage(store?.brandId);
    }
  }, [store, languagesStatus, loadLanguage, language])

  useEffect(() => {
    if (!!store && !!productqr && !!iOS) {
      setDialogOpen(true);
    }
  }, [store, productqr])

  // FIXME should be a more meaningful message or should redirect to a unauthorized page
  if (!sid) {
    return (
      <>
        Please scan store QR code to access to this app
      </>
    )
  }

  return !language // language is not loaded
    || loading // store data and/or product data is loading
    || (!productqr && !store) // no store data is loaded
    || (!!productqr && !product) // no product data loaded when product qr value is provided
    ? (
      <>
        <LoadingBox sx={{ height: '100%' }} />
        <Grid className={classes.splashScreen}>
          <img
            className={classes.splashScreenImg}
            src="./imgs/Powered by 8th Wall Badge - Black-01.png"
            alt="" />
        </Grid>
      </>
    )
    : (!!store && !productqr)
      ? (<Redirect to="/" />)
      : (
        <>
          {/* // FIXME move permission logic to permission page */}
          {/* <PermissionsDialog open={dialogOpen} onClose={handleDialogClose} onPermissionGranted={handlePermissionStatus} /> */}
          {(!iOS || !!permissionStatus) && (<Redirect to="/allow-scan?showArPage=true" />)}
        </>

      )
}

export default InitialPage;
