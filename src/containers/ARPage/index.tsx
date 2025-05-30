import React, { useEffect, useState } from 'react';
import ArComponent from './ArComponent';
import LoadingScreen from './LoadingScreen';
import { Fade } from '@mui/material';
import { useAppContext } from 'src/core/events';
import { concat, filter, take } from 'rxjs';
import { useBoundStore } from 'src/core/store';

const ARPage = () => {
  const { appLoadingStateEvent, arResourcesLoadEvent, aFrameModelLoadedEvent } = useAppContext();

  const [modelLoading, setModelLoading] = useState(true);

  const productData = useBoundStore(state => state.product);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    const subscription = appLoadingStateEvent.pipe(
      filter(v => !!v)
    ).subscribe(() => {
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
