import React, { memo, useEffect, useState } from 'react';
import { QueryObserver, useQueryClient } from 'react-query';
import { IProduct, IQRCodeData } from 'src/core/declarations/app';
import { QueryKeys } from 'src/core/declarations/enum';
import ArComponent from './ArComponent';
import LoadingScreen from './LoadingScreen';
import { Fade } from '@mui/material';
import { useAppContext } from 'src/core/store';
import { concat, filter, take } from 'rxjs';

const ARPage = () => {
  const { appLoadingStateEvent, arResourcesLoadEvent, aFrameModelLoadedEvent } = useAppContext();

  const [modelLoading, setModelLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    const subscription = appLoadingStateEvent.pipe(
      filter(v => !!v)
    ).subscribe(appIsLoading => {
      setModelLoading(true);
      appLoadingStateEvent.next(false);
    })

    return () => { subscription.unsubscribe(); }
  }, [appLoadingStateEvent])

  useEffect(() => {
    if (arResourcesLoadEvent) {
      const subscription = concat( 
        arResourcesLoadEvent.pipe(filter(v => !!v), take(1)),
        aFrameModelLoadedEvent
      ).subscribe(() => {
        setModelLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      }
    }
  }, [arResourcesLoadEvent, aFrameModelLoadedEvent])

  return (
    <>
      <ArComponent />
      <Fade in={modelLoading}>
        <LoadingScreen />
      </Fade>
    </>
  )
}

export default ARPage;
