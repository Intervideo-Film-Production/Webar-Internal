import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { IProduct } from 'src/core/declarations/app';
import { QueryKeys } from 'src/core/declarations/enum';
import ArComponent from './ArComponent';
import LoadingScreen from './LoadingScreen';
import { Fade } from '@mui/material';
import { useAppContext } from 'src/core/store';
import { concat, filter, take } from 'rxjs';
import { useLocation } from 'react-router-dom';

const ARPage = () => {
  const { appLoadingStateEvent, arResourcesLoadEvent, aFrameModelLoadedEvent } = useAppContext();
  const location = useLocation<{ productId: string }>();
  const productId = location.state && location.state.productId;

  const [modelLoading, setModelLoading] = useState(true);

  const queryClient = useQueryClient();
  const productData = !!productId
    ? queryClient.getQueryData<IProduct>([QueryKeys.product, productId])
    : queryClient.getQueryData<IProduct>(QueryKeys.product);


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
      ).subscribe(v => {
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
        <LoadingScreen product={productData as IProduct} />
      </Fade>
    </>
  )
}

export default ARPage;
