import React from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AppHeader } from "../containers";

import { ThemeProvider } from "@emotion/react";
import { Container, CssBaseline, ThemeOptions } from "@mui/material";
import createAppTheme from "../core/theme";
// import CookieConsent from "src/components/CookieConsent";
import { useAppContext } from "src/core/events";
import { FontLoader } from "src/components/FontLoader";
// import RegisterAframe from "src/A-Frame/RegisterAframe";
import queryString from "query-string";
import { useBoundStore } from "src/core/store";

const AppRouter = () => {
  const { appTheme } = useAppContext();
  const storeData = useBoundStore(({ store }) => store);
  const location = useLocation();
  const brandName = storeData?.brandName;
  const logo = storeData?.logo;
  const fontSetting = storeData?.fontSetting;
  const headerStyles = storeData?.headerStyles;
  const loadingBoxStyles = storeData?.loadingBoxStyles;
  const arPageStyles = storeData?.arPageStyles;
  const homePageStyles = storeData?.homePage?.homePageStyles;
  const scanPageStyles = storeData?.scanPageStyles;
  const productFinderStyles = storeData?.productFinderStyles;
  const coreTheme = storeData?.coreTheme;

  const theme = createAppTheme(
    !!coreTheme
      ? coreTheme.fontFamily
      : '"Roboto", "Helvetica", "Arial", sans-serif',
    !!coreTheme ? (JSON.parse(coreTheme.styles) as ThemeOptions) : {},
    fontSetting,
    !!headerStyles ? JSON.parse(headerStyles.styles) : null,
    !!loadingBoxStyles ? JSON.parse(loadingBoxStyles.styles) : null,
    {
      loadingScreen:
        arPageStyles && arPageStyles.loadingScreen
          ? {
            ...JSON.parse(arPageStyles.loadingScreen.styles),
            showProductHeadline:
              arPageStyles.loadingScreen.showProductHeadline,
          }
          : null,
      productClaim:
        arPageStyles && arPageStyles.productClaim
          ? JSON.parse(arPageStyles.productClaim.styles)
          : null,
      pageController:
        arPageStyles && arPageStyles.pageController
          ? JSON.parse(arPageStyles.pageController.styles)
          : null,
      compareDrawer:
        arPageStyles && arPageStyles.compareDrawer
          ? JSON.parse(arPageStyles.compareDrawer.styles)
          : null,
      productCompareBox:
        arPageStyles && arPageStyles.productCompareBox
          ? JSON.parse(arPageStyles.productCompareBox.styles)
          : null,
      compareDetails:
        arPageStyles && arPageStyles.compareDetails
          ? JSON.parse(arPageStyles.compareDetails.styles)
          : null,
      reviewContent:
        arPageStyles && arPageStyles.reviewContent
          ? JSON.parse(arPageStyles.reviewContent.styles)
          : null,
      buttonPopupContent:
        arPageStyles && arPageStyles.buttonPopupContent
          ? JSON.parse(arPageStyles.buttonPopupContent.styles)
          : null,
      buttonDrawerContent: arPageStyles && arPageStyles.buttonDrawerContent
      ? JSON.parse(arPageStyles.buttonDrawerContent.styles)
      : null,
      beardStyles:
        arPageStyles && arPageStyles.beardStyles
          ? JSON.parse(arPageStyles.beardStyles.styles)
          : null,
      infoMenu:
        arPageStyles && arPageStyles.infoMenu
          ? JSON.parse(arPageStyles.infoMenu.styles)
          : null,
    },
    !!homePageStyles ? JSON.parse(homePageStyles.styles) : null,
    !!scanPageStyles ? JSON.parse(scanPageStyles.styles) : null,
    !!productFinderStyles ? JSON.parse(productFinderStyles.styles) : null
  );

  appTheme.next(theme);

  if (!storeData) {
    let { sid, productqr } = queryString.parse(location.search) as {
      sid: string | null;
      productqr: string | null;
    };
    if (!!sid) {
      localStorage.setItem("storeID", sid);
    }
    if (!!productqr) {
      localStorage.setItem("productqr", productqr);
    }

    if (!!localStorage.getItem("storeID")) return <Navigate to="/initialize" />;
  }

  return (
    <>
      {/* FIXME */}
      {/* Register Aframe */}

      <ThemeProvider theme={theme}>
        {/* Css normalise */}
        <CssBaseline />
        {/* load fonts */}
        <FontLoader />

        <Container
          disableGutters
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <AppHeader brandName={brandName} logo={logo} />
          {/* nested route outlet */}
          <Outlet />
          {/* Cookie Consent */}
          {/* <CookieConsent /> */}
        </Container>
      </ThemeProvider>
    </>
  );
};

export default AppRouter;
