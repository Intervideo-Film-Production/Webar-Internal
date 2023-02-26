import {
  memo,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import ARPageController from "./Controller";
import { AppGrid } from "src/components";
import { Grid, Toolbar } from "@mui/material";
import { AScene } from "src/A-Frame/AScene";
import { BehaviorSubject, filter, Subject } from "rxjs";
import ReviewContent from "./ReviewContent";
// import ButtonDrawerContent from "./ButtonDrawerContent";
import {
  IProduct,
  IButtonContent,
  IBeardStyle,
  // IStore,
  IProductColor,
} from "src/core/declarations/app";
import InfoMenu from "./InfoMenu";
import ScreenOverlay from "./ScreenOverlay";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import BeardStyleContent from "./BeardStyleContent";
import { useBoundStore } from "src/core/store";
import ButtonContent from "./ButtonContent";

const ArComponent = memo(() => {
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewContentOpen, setReviewContentOpen] = useState(false);
  const [showGrandControl, setShowGrandControl] = useState(true);
  const [buttonName, setButtonName] = useState("");
  const [infoMenuOpen, setInfoMenuOpen] = useState(false);

  const { i18n } = useTranslation();
  const location = useLocation();
  const productId = (location.state as { productId: string })?.productId;

  const product = useBoundStore(state => state.product);
  const { buttons, getButtonContents } = useBoundStore(state => ({
    buttons: state.buttons,
    getButtonContents: state.getButtonContents
  }))

  const fetchButtonContent = useCallback(() => {
    if (!!product?.id) getButtonContents(product.id, i18n.language);

  }, [getButtonContents, product, i18n.language])

  useEffect(() => {
    fetchButtonContent();
  }, [fetchButtonContent]);

  const headlineRef = useRef<HTMLDivElement>(null);
  const [headlineHeight, setHeadlineHeight] = useState(0);

  const arModelUrlSub = useMemo(() => new Subject<IProduct>(), []);
  const buttonListSub = useMemo(() => new Subject<IButtonContent[]>(), []);
  const beardStylesSub = useMemo(() => new Subject<IBeardStyle[]>(), []);

  useEffect(() => {
    if (!!product) {
      arModelUrlSub.next(product);
    }
  }, [arModelUrlSub, product]);

  useEffect(() => {
    if (!!buttons) {
      buttonListSub.next(buttons);
    }
  }, [buttonListSub, buttons]);

  useEffect(() => {
    if (!!product?.beardStyles) {
      beardStylesSub.next(product.beardStyles);
    }
  }, [beardStylesSub, product?.beardStyles]);

  useEffect(() => {
    if (headlineRef.current) {
      setHeadlineHeight(headlineRef.current.clientHeight);
    }
  }, [headlineRef]);


  const recenterEvent = useMemo(() => new Subject(), []);
  const arButtonToggleEvent = useMemo(() => new Subject<string>(), []);
  const productColorEvent = useMemo(() => new Subject<IProductColor>(), []);
  // const beardStyleEvent = useMemo(
  //   () => new BehaviorSubject<boolean>(false),
  //   []
  // );
  const switchBeardStyleEvent = useMemo(() => new Subject<IBeardStyle>(), []);

  // useEffect(() => {
  //   if (beardStyleEvent) {
  //     const subscription = beardStyleEvent
  //       .pipe(filter(() => beardStyles && beardStyles.length > 0))
  //       .subscribe((shouldBeardStyleShow) => {
  //         setShowGrandControl(!shouldBeardStyleShow);
  //       });

  //     return () => subscription.unsubscribe();
  //   }
  // }, [beardStyleEvent, beardStyles]);

  const handleReviewToggle = useCallback(
    (shouldReviewOpen: boolean) => {
      setReviewContentOpen(shouldReviewOpen);
    }, []);

  const beardStyleEvent = useMemo(
    () => new BehaviorSubject<boolean>(false),
    []
  );

  useEffect(() => {
    if (beardStyleEvent) {
      const subscription = beardStyleEvent
        .pipe(filter(() => !!product?.beardStyles && product?.beardStyles.length > 0))
        .subscribe((shouldBeardStyleShow) => {
          setShowGrandControl(!shouldBeardStyleShow);
        });

      return () => subscription.unsubscribe();
    }
  }, [beardStyleEvent, product?.beardStyles]);

  const infoMenuHandle = useCallback((shouldOpen: boolean) => {
    setInfoMenuOpen(shouldOpen);
    setShowGrandControl(!shouldOpen);
  }, []);

  const reCenterHandle = useCallback(() => {
    if (recenterEvent) {
      recenterEvent.next({});
    }
  }, [recenterEvent]);

  // const compareDrawerHandle = useCallback(() => {
  //   setDrawerOpen(true);
  //   setShowGrandControl(false);
  // }, []);

  const buttonPopupHandle = useCallback(
    (buttonName: string) => {
      setButtonName(buttonName);
      if (arButtonToggleEvent) arButtonToggleEvent.next(buttonName);
      setShowGrandControl(!buttonName);
    },
    [arButtonToggleEvent]
  );

  const arButtonHandle = useCallback(
    (arButtonName: string) => {
      buttonPopupHandle(arButtonName);
    },
    [buttonPopupHandle]
  );

  const handleShowBeardStyle = useCallback((beardStyleId: string) => {
    beardStyleEvent.next(true);
    const beardStyle = product?.beardStyles.find(b => b.id === beardStyleId);
    if (!!beardStyle) switchBeardStyleEvent.next(beardStyle);
  }, [product?.beardStyles, beardStyleEvent, switchBeardStyleEvent]);

  return (
    <AppGrid
      sx={{
        alignItems: "start",
        gridTemplateRows: "auto auto 1fr auto",
      }}
    >
      <Toolbar />

      {/* ar model */}
      <Grid>
        <AScene
          productDataSub={arModelUrlSub}
          buttonListSub={buttonListSub}
          beardStylesSub={beardStylesSub}
          recenterEvent={recenterEvent}
          onButtonClick={arButtonHandle}
          buttonToggleEvent={arButtonToggleEvent}
          productColorSub={productColorEvent}
        // beardStyleEvent={beardStyleEvent}`
        // switchBeardStyleEvent={switchBeardStyleEvent}
        />

        <ScreenOverlay buttonName={buttonName} />
      </Grid>

      {/* controller */}
      <ARPageController
        showGrandControl={showGrandControl}
        onInfo={() => infoMenuHandle(true)}
        onRecenter={() => reCenterHandle()}
        onReview={() => handleReviewToggle(true)}
        productColorSub={productColorEvent}
      />

      {/* Expand Content */}
      <ReviewContent
        productId={productId ?? product?.id}
        open={reviewContentOpen}
        onReviewToggle={handleReviewToggle}
      />

      {/* Button Popup Content */}
      <ButtonContent
        buttonName={buttonName}
        onToggle={buttonPopupHandle}
        onShowBeardStyle={handleShowBeardStyle} />

      <BeardStyleContent
        beardStyleEvent={beardStyleEvent}
        switchBeardStyleEvent={switchBeardStyleEvent}
        beardStyles={product?.beardStyles}
        headlineHeight={headlineHeight}
        onShowButtonContent={buttonName => buttonPopupHandle(buttonName)}
      />

      <InfoMenu
        open={infoMenuOpen}
        onClose={() => infoMenuHandle(false)}
      />
    </AppGrid>
  );
});

export default ArComponent;
