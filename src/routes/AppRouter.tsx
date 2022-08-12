import React from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { AppHeader, LoginPage } from "../containers";

import routeMaps, { AppPages } from "./routeMap";
import { ThemeProvider } from "@emotion/react";
import { Container, CssBaseline, ThemeOptions } from "@mui/material";
import PrivateRoute from "./PrivateRoute";
import createAppTheme from "../core/theme";
import { useQueryClient } from "react-query";
import { QueryKeys } from "../core/declarations/enum";
import { IQRCodeData } from "../core/declarations/app";
import CookieConsent from "src/components/CookieConsent";
import { useAppContext } from "src/core/store";
import { FontLoader } from "src/components/FontLoader";
import RegisterAframe from "src/A-Frame/RegisterAframe";
import queryString from "query-string";

const loginEnabled = process.env.REACT_APP_ENABLE_LOGIN === "TRUE";
const script8thWallDisabled = process.env.REACT_APP_8THWALL_DISABLED;

const AppRouter = () => {
  const { appTheme } = useAppContext();
  const queryClient = useQueryClient();
  const qrCodeData = queryClient.getQueryData(QueryKeys.qrCode) as IQRCodeData;
  const location = useLocation();
  const brandName = qrCodeData?.brandName;
  const logo = qrCodeData?.logo;
  const fontSetting = qrCodeData?.fontSetting;
  const headerStyles = qrCodeData?.headerStyles;
  const loadingBoxStyles = qrCodeData?.loadingBoxStyles;
  const arPageStyles = qrCodeData?.arPageStyles;
  const homePageStyles = qrCodeData?.homePage?.homePageStyles;
  const scanPageStyles = qrCodeData?.scanPageStyles;
  const productFinderStyles = qrCodeData?.productFinderStyles;
  const coreTheme = qrCodeData?.coreTheme;

  const theme = createAppTheme(
    !!coreTheme
      ? coreTheme.fontFamily
      : '"Roboto", "Helvetica", "Arial", sans-serif',
    !!coreTheme ? (JSON.parse(coreTheme.styles) as ThemeOptions) : {},
    fontSetting || {},
    !!headerStyles ? JSON.parse(headerStyles.styles) : null,
    !!loadingBoxStyles ? JSON.parse(loadingBoxStyles.styles) : null,
    {
      loadingScreen:
        arPageStyles && arPageStyles.loadingScreen
          ? { ...JSON.parse(arPageStyles.loadingScreen.styles), showProductHeadline: arPageStyles.loadingScreen.showProductHeadline }
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

  if (!qrCodeData) {
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

    if (!!localStorage.getItem("storeID")) return <Redirect to="/initialize" />;
  }

  return (
    <>

      {/* Register Aframe */}
      {script8thWallDisabled ? null : <RegisterAframe />}

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

          <Switch>
            {routeMaps.map((route, idx) => {
              return (
                <PrivateRoute
                  key={`route-${idx}`}
                  path={route.path}
                  exact={route.exact}
                  component={route.component}
                />
              );
            })}
            {loginEnabled && (
              <Route path={AppPages.LoginPage} component={LoginPage} />
            )}
          </Switch>

          {/* Cookie Consent */}
          <CookieConsent />
        </Container>
      </ThemeProvider>
    </>
  );
};

export default AppRouter;

