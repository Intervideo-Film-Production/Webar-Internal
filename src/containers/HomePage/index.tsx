
import { Grid, Typography, Toolbar } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppGrid, AppButton, LoadingBox } from 'src/components';
import HomePageBackground from './HomePageBackground';
import { useBoundStore } from 'src/core/store';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [appLoading, setAppLoading] = useState(true);
  const storeData = useBoundStore(state => state.store);
  const backgroundVideo = storeData?.homePage.backgroundVideo;

  const onBackgroundDisplayHandle = useCallback(() => {
    setAppLoading(false);
  }, [])

  return (
    <>
      {!!backgroundVideo && (<LoadingBox sx={{
        zIndex: 9,
        height: '100%',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        visibility: appLoading ? 'visible' : 'hidden'
      }}
      />)}

      <AppGrid sx={(theme: any) => ({
        alignItems: "start",
        gridTemplateRows: "auto 1fr",
        ...theme.homePageStyles.root
      })}>
        <Toolbar />
        <AppGrid sx={{
          gridTemplateRows: "1fr auto",
          bgcolor: "transparent",
          p: 2,
          position: "relative",
          alignSelf: "stretch",
          background: "radial-gradient(#fbfbfb 20%, #d9d9d9)"
        }}>
          <HomePageBackground source={backgroundVideo} onBackgroundDisplayable={onBackgroundDisplayHandle} />

          <Grid sx={{
            display: 'grid',
            alignContent: 'flex-start',
            position: 'relative'
          }}>
            <Typography
              variant="h4"
              sx={(theme) => theme.homePageStyles.subtitle}
            >{t("HomePageTitleSubtitle")}</Typography>
            <Typography
              variant="h2"
              sx={theme => theme.homePageStyles.title}
            >{t("HomePageTitle")}</Typography>
          </Grid>

          <Grid sx={{
            textAlign: 'center',
            marginBottom: 8
          }}>
            <AppButton
              sx={(theme) => ({ ...theme.homePageStyles.startButton })}
              variant="contained"
              onClick={() => { navigate("/allow-scan"); }}
            >
              {t('HomePageButtonText')}
            </AppButton>
          </Grid>
        </AppGrid>
      </AppGrid>
    </>
  )
}

export default HomePage;
