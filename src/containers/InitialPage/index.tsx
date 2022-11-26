import React, { useCallback, useEffect, useState } from 'react';
import {
  useLocation
} from 'react-router-dom';
import queryString from 'query-string';
import { useAppContext } from 'src/core/store';
import { useQuery } from 'react-query';
import { QueryKeys } from '../../core/declarations/enum';
import { getProduct, getQRCodeData } from '../../crud/crud';
import { Redirect } from 'react-router-dom';
import { LoadingBox } from 'src/components';
import { getDataExportDate } from 'src/crud/crud.local';
import PermissionsDialog from './PermissionDialog';
import { isIOS } from 'src/core/helpers';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useLanguage } from 'src/core/i18n';

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
  const { languageLoaded, supportedLanguagesFetched, loadLanguage } = useLanguage();

  const location = useLocation();
  let { sid, productqr } = queryString.parse(location.search) as { sid: string | null, productqr: string | null };
  console.log("productqr", productqr);
  if (!sid) {
    let storedSid = localStorage.getItem("storeID");
    if (!!storedSid) sid = storedSid;
  } else {
    localStorage.setItem("storeID", sid);
  }

  // FIXME not necessary as product is frequently changed & displayed
  // if (!productqr) {
  //   let storedProductqr = localStorage.getItem("productqr");
  //   if (!!storedProductqr) productqr = storedProductqr;
  // }
  // else {
  //   localStorage.setItem("productqr", productqr);
  // }

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

    return () => {
      localStorage.removeItem("productqr");
    }
  }, [])

  // FIXME should handle productqr as well
  useEffect(() => {
    if (initialPageUrl && sid) {

      initialPageUrl.next(`${document.location.href}?sid=${sid}`);
    }
  }, [initialPageUrl, sid, location])

  const { isLoading, error, data: qrCodeData } = useQuery(QueryKeys.qrCode, () => getQRCodeData(sid as string), {
    staleTime: Infinity,
    cacheTime: Infinity
  });

  const { isLoading: isProductDataLoading, refetch, data: productData } = useQuery([QueryKeys.product, productqr], () => {
    return getProduct(productqr as string, languageLoaded, qrCodeData?.id as string)
  }, {
    enabled: false,
    cacheTime: Infinity
  });

  useEffect(() => {
    if (supportedLanguagesFetched && qrCodeData?.brandId && !languageLoaded) {
      loadLanguage(qrCodeData?.brandId);
    }
  }, [qrCodeData, supportedLanguagesFetched, loadLanguage, languageLoaded])

  useEffect(() => {
    if (!!qrCodeData?.id && !!productqr && languageLoaded) {
      refetch();
    }
  }, [qrCodeData, refetch, productqr, languageLoaded])

  useEffect(() => {
    if (!!qrCodeData && !!productqr && !!iOS) {
      setDialogOpen(true);
    }
  }, [qrCodeData, productqr])

  if (error) {
    return (
      <>
        {error}
      </>
    )
  }
  if (!sid) {
    return (
      <>
        Please scan store QR code to access to this app
      </>
    )
  }

  return isLoading
    || !languageLoaded
    || (!productqr && !qrCodeData)
    || (!!productqr && isProductDataLoading)
    || (!!productqr && !productData)
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
    : (!!qrCodeData && !productqr)
      ? (<Redirect to="/" />)
      : (
        <>
          <PermissionsDialog open={dialogOpen} onClose={handleDialogClose} onPermissionGranted={handlePermissionStatus} />
          {(!iOS || !!permissionStatus) && (<Redirect to="/ar-page" />)}
        </>

      )
}

export default InitialPage;
