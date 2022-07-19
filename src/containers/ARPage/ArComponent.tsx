import React, { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import ARPageController from './Controller';
import { AppGrid } from 'src/components';
import { Grid, Toolbar } from '@mui/material';
import ProductHeadline from './ProductHeadline';
import { AScene } from 'src/A-Frame/AScene';
import { BehaviorSubject, filter, Subject } from 'rxjs';
import ReviewContent from './ReviewContent';
import CompareDrawer from './CompareDrawer';
import ButtonPopupContent from './ButtonPopupContent';
import { IProduct, IButtonContent, IBeardStyle } from 'src/core/declarations/app';
import { useQuery, useQueryClient } from 'react-query';
import { QueryKeys } from 'src/core/declarations/enum';
import CompareDetails from './CompareDetails';
import InfoMenu from './InfoMenu';
import ScreenOverlay from './ScreenOverlay';
import { getButtonAnimationContent } from 'src/crud/crud';
import { useTranslation } from 'react-i18next';
import BeardStyleContent from './BeardStyleContent';

const ArComponent = memo(() => {

  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  const {
    id: productId,
    name,
    productClaim,
    arObjectUrl,
    beardStyles
  } = queryClient.getQueryData<IProduct>(QueryKeys.product) as IProduct;

  const { data: buttonData } = useQuery(QueryKeys.buttonAnimationContent, () => {
    return getButtonAnimationContent((productId as string), i18n.language)
  }, {
    enabled: !!productId,
    notifyOnChangeProps: ['data']
  });

  const headlineRef = useRef<HTMLDivElement>(null);
  const [headlineHeight, setHeadlineHeight] = useState(0);

  const arModelUrlSub = useMemo(() => new Subject<string>(), []);
  const buttonListSub = useMemo(() => new Subject<IButtonContent[]>(), []);
  const beardStylesSub = useMemo(() => new Subject<IBeardStyle[]>(), []);

  useEffect(() => {
    if (!!arObjectUrl) {
      arModelUrlSub.next(arObjectUrl);
    }

  }, [arModelUrlSub, arObjectUrl])

  useEffect(() => {
    if (!!buttonData) {
      buttonListSub.next(buttonData);
    }
  }, [buttonListSub, buttonData])

  useEffect(() => {
    if (!!beardStyles) {
      beardStylesSub.next(beardStyles);
    }
  }, [beardStylesSub, beardStyles])

  useEffect(() => {
    if (headlineRef.current) {
      setHeadlineHeight(headlineRef.current.clientHeight);
    }
  }, [headlineRef])

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewContentOpen, setReviewContentOpen] = useState(false);
  const [showGrandControl, setShowGrandControl] = useState(true);
  const [showControl, setShowControl] = useState(false);
  const [buttonName, setButtonName] = useState('');
  const [compareProductId, setCompareProductId] = useState('');
  const [compareDetailsOpen, setCompareDetailsOpen] = useState(false);
  const [infoMenuOpen, setInfoMenuOpen] = useState(false);

  const showControlHandle = useCallback((shouldControlShow: boolean) => {
    setShowControl(shouldControlShow);
  }, [])

  const handleDrawerToggle = useCallback((shouldDrawerOpen: boolean) => {
    setShowGrandControl(!shouldDrawerOpen);
    setDrawerOpen(shouldDrawerOpen);
  }, [])

  const handleCompareDetails = useCallback((compareProductId: string) => {
    setCompareProductId(compareProductId);
    setCompareDetailsOpen(true);
  }, [])

  const handleReviewToggle = useCallback((shouldReviewOpen: boolean) => {
    setReviewContentOpen(shouldReviewOpen);
    showControlHandle(false);
  }, [showControlHandle]);

  const handleCompareDetailsClose = useCallback((shouldCloseCompareDrawer?: boolean) => {
    setCompareDetailsOpen(false);

    if (shouldCloseCompareDrawer) {
      setDrawerOpen(false);
      setShowGrandControl(true);

    }
  }, [])

  const recenterEvent = useMemo(() => new Subject(), []);
  const arButtonToggleEvent = useMemo(() => new Subject<string>(), []);
  const beardStyleEvent = useMemo(() => new BehaviorSubject<boolean>(false), []);
  const switchBeardStyleEvent = useMemo(() => new Subject<string>(), []);

  useEffect(() => {
    if (beardStyleEvent) {
      const subscription = beardStyleEvent
        .pipe(
          filter(() => beardStyles && beardStyles.length > 0)
        )
        .subscribe(shouldBeardStyleShow => {
          setShowGrandControl(!shouldBeardStyleShow);
        })

      return () => subscription.unsubscribe();
    }
  }, [beardStyleEvent, beardStyles])

  const infoMenuHandle = useCallback((shouldOpen: boolean) => {
    setInfoMenuOpen(shouldOpen);
    setShowGrandControl(!shouldOpen);
  }, [])

  const reCenterHandle = useCallback(() => {
    if (recenterEvent) {
      recenterEvent.next({});
    }
  }, [recenterEvent])

  const compareDrawerHandle = useCallback(() => {
    setDrawerOpen(true);
    setShowGrandControl(false);
    setShowControl(false);
  }, [])

  const buttonPopupHandle = useCallback((buttonName: string) => {
    setButtonName(buttonName);
    if (arButtonToggleEvent) arButtonToggleEvent.next(buttonName);
    setShowGrandControl(!buttonName);
  }, [arButtonToggleEvent])

  const arButtonHandle = useCallback((arButtonName: string) => {
    /**
     * data should be used to render popup content somehow
    */
    setShowControl(false);
    buttonPopupHandle(arButtonName);
  }, [buttonPopupHandle])

  const handleShowBeardStyle = (beardStyleId: string) => {
    beardStyleEvent.next(true);
    switchBeardStyleEvent.next(beardStyleId);
  }

  return (
    <AppGrid sx={{
      alignItems: "start",
      gridTemplateRows: 'auto auto 1fr auto',
    }}>
      <Toolbar />

      {/* headline */}
      <ProductHeadline ref={headlineRef} productName={name} productClaim={productClaim} />

      {/* ar model */}
      <Grid>
        <AScene
          productDataSub={arModelUrlSub}
          buttonListSub={buttonListSub}
          beardStylesSub={beardStylesSub}
          recenterEvent={recenterEvent}
          onButtonClick={arButtonHandle}
          buttonToggleEvent={arButtonToggleEvent}
          beardStyleEvent={beardStyleEvent}
          switchBeardStyleEvent={switchBeardStyleEvent}
        />
        <ScreenOverlay
          buttonName={buttonName}
        />

      </Grid>

      {/* controller */}
      <ARPageController
        showControl={showControl}
        showGrandControl={showGrandControl}
        onShowControl={shouldControlDisplay => showControlHandle(shouldControlDisplay)}
        onInfo={() => infoMenuHandle(true)}
        onRecenter={() => reCenterHandle()}
        onReview={() => handleReviewToggle(true)}
        onCompare={() => compareDrawerHandle()}
      />

      {/* compare list */}
      <CompareDrawer drawerOpen={drawerOpen} onDrawerToggle={handleDrawerToggle} onCompareDetails={handleCompareDetails} />

      {/* Compare Details */}
      <CompareDetails open={compareDetailsOpen} compareProductId={compareProductId} onCompareDetailsClose={handleCompareDetailsClose} />

      {/* Expand Content */}
      <ReviewContent
        productId={productId}
        open={reviewContentOpen}
        onReviewToggle={handleReviewToggle}
        name={name}
        productClaim={productClaim} />

      {/* Button Popup Content */}
      {/* FIXME */}
      <ButtonPopupContent
        buttonName={buttonName}
        onToggle={buttonPopupHandle}
        onShowBeardStyle={handleShowBeardStyle}
      />

      <BeardStyleContent
        beardStyleEvent={beardStyleEvent}
        switchBeardStyleEvent={switchBeardStyleEvent}
        beardStyles={beardStyles}
        headlineHeight={headlineHeight}
        onShowButtonContent={buttonName => buttonPopupHandle(buttonName)}
      />

      <InfoMenu
        open={infoMenuOpen}
        onClose={() => infoMenuHandle(false)}
        headlineHeight={headlineHeight}
      />
    </AppGrid>
  )
});

export default ArComponent;
