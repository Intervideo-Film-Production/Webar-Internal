import React, {
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
import ButtonPopupContent from "./ButtonPopupContent";
import {
  IProduct,
  IButtonContent,
  IBeardStyle,
} from "src/core/declarations/app";
import { useQuery, useQueryClient } from "react-query";
import { QueryKeys } from "src/core/declarations/enum";
import InfoMenu from "./InfoMenu";
import ScreenOverlay from "./ScreenOverlay";
import { getButtonAnimationContent } from "src/crud/crud";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import BeardStyleContent from "./BeardStyleContent";

const ArComponent = memo(() => {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const location = useLocation<{ productId: string }>();
  const productId = location.state && location.state && location.state.productId;

  const productData = !!productId
    ? queryClient.getQueryData<IProduct>([QueryKeys.product, productId]) as IProduct
    : queryClient.getQueryData<IProduct>(QueryKeys.product) as IProduct;

  const {
    id,
    beardStyles,
  } = productData;

  const { data: buttonData } = useQuery(
    QueryKeys.buttonAnimationContent,
    () => {
      return getButtonAnimationContent(id as string, i18n.language);
    },
    {
      enabled: !!id,
      notifyOnChangeProps: ["data"],
    }
  );

  const headlineRef = useRef<HTMLDivElement>(null);
  const [headlineHeight, setHeadlineHeight] = useState(0);

  const arModelUrlSub = useMemo(() => new Subject<IProduct>(), []);
  const buttonListSub = useMemo(() => new Subject<IButtonContent[]>(), []);
  const beardStylesSub = useMemo(() => new Subject<IBeardStyle[]>(), []);

  useEffect(() => {
    if (!!productData) {
      // const { arObjectUrl, cubemap, arModelScale } = productData;
      arModelUrlSub.next(productData);
    }
  }, [arModelUrlSub, productData]);

  useEffect(() => {
    if (!!buttonData) {
      buttonListSub.next(buttonData);
    }
  }, [buttonListSub, buttonData]);

  useEffect(() => {
    if (!!beardStyles) {
      beardStylesSub.next(beardStyles);
    }
  }, [beardStylesSub, beardStyles]);

  useEffect(() => {
    if (headlineRef.current) {
      setHeadlineHeight(headlineRef.current.clientHeight);
    }
  }, [headlineRef]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewContentOpen, setReviewContentOpen] = useState(false);
  const [showGrandControl, setShowGrandControl] = useState(true);
  const [buttonName, setButtonName] = useState("");
  const [infoMenuOpen, setInfoMenuOpen] = useState(false);

  const handleReviewToggle = useCallback(
    (shouldReviewOpen: boolean) => {
      setReviewContentOpen(shouldReviewOpen);
    }, []);

  const recenterEvent = useMemo(() => new Subject(), []);
  const arButtonToggleEvent = useMemo(() => new Subject<string>(), []);
  const beardStyleEvent = useMemo(
    () => new BehaviorSubject<boolean>(false),
    []
  );
  const switchBeardStyleEvent = useMemo(() => new Subject<IBeardStyle>(), []);

  useEffect(() => {
    if (beardStyleEvent) {
      const subscription = beardStyleEvent
        .pipe(filter(() => beardStyles && beardStyles.length > 0))
        .subscribe((shouldBeardStyleShow) => {
          setShowGrandControl(!shouldBeardStyleShow);
        });

      return () => subscription.unsubscribe();
    }
  }, [beardStyleEvent, beardStyles]);

  const infoMenuHandle = useCallback((shouldOpen: boolean) => {
    setInfoMenuOpen(shouldOpen);
    setShowGrandControl(!shouldOpen);
  }, []);

  const reCenterHandle = useCallback(() => {
    if (recenterEvent) {
      recenterEvent.next({});
    }
  }, [recenterEvent]);

  const compareDrawerHandle = useCallback(() => {
    setDrawerOpen(true);
    setShowGrandControl(false);
  }, []);

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
    const beardStyle = beardStyles.find(b => b.id === beardStyleId);
    if (!!beardStyle) switchBeardStyleEvent.next(beardStyle);
  }, [beardStyles]);

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
          beardStyleEvent={beardStyleEvent}
          switchBeardStyleEvent={switchBeardStyleEvent}
        />
        <ScreenOverlay buttonName={buttonName} />
      </Grid>

      {/* controller */}
      <ARPageController
        showGrandControl={showGrandControl}
        onInfo={() => infoMenuHandle(true)}
        onRecenter={() => reCenterHandle()}
        onReview={() => handleReviewToggle(true)}
      />

      {/* Expand Content */}
      <ReviewContent
        productId={productId ?? id}
        open={reviewContentOpen}
        onReviewToggle={handleReviewToggle}
      />

      {/* Button Popup Content */}
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
      />
    </AppGrid>
  );
});

export default ArComponent;
