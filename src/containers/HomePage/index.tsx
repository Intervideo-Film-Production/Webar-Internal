
import { Grid, Typography, Toolbar } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { QueryKeys } from 'src/core/declarations/enum';
import { AppGrid, AppButton, LoadingBox } from 'src/components';
import { useQueryClient } from 'react-query';
import HomePageBackground from './HomePageBackground';
import { IQRCodeData } from 'src/core/declarations/app';

const HomePage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [appLoading, setAppLoading] = useState(true);
  const [nextPage, setNextPage] = useState(false);
  const queryClient = useQueryClient();
  const qrCodeData = queryClient.getQueryData<IQRCodeData>(QueryKeys.qrCode);
  const backgroundVideo = qrCodeData?.homePage.backgroundVideo;

  const onBackgroundDisplayHandle = useCallback(() => {
    setAppLoading(false);
  }, [])

  // temporary fix the background flickering issue caused by video component is disposed when switching pages
  // by putting a loading box when next page button is clicked
  useEffect(() => {
    if (nextPage) {
      history.push('/scan-page');
    }
  })

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
        visibility: appLoading || nextPage ? 'visible' : 'hidden'
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
          alignSelf: "stretch"
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
              onClick={() => { setNextPage(true); }}
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
