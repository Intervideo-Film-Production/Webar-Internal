import React from 'react';
import { DataTypes, ProductTypes } from "./enum";

interface IComponentStyles {
  [key: string]: string | number;
}

declare module '@mui/material/styles' {
  interface Theme {
    background: {
      cyan: string;
    };

    fontSetting: IFont[];

    headerStyles: {
      root: IComponentStyles;
      logo: IComponentStyles;
      iconButton: IComponentStyles;
    };
    productCompareBox?: {};

    loadingBoxStyles: IComponentStyles;

    arPageStyles: {
      loadingScreen: {
        showProductHeadline: boolean;
        root: IComponentStyles;
        titleBox: {
          root: IComponentStyles;
          title: IComponentStyles;
          subtitle: IComponentStyles;
        };
        progressLoadingBar: IComponentStyles;
        mainRatingBox: {
          root: IComponentStyles;
          rating: IComponentStyles;
          text: IComponentStyles;
        };
        ratingBoxes: {
          root: IComponentStyles;
          rating: IComponentStyles;
          text: IComponentStyles;
        };
        reviewTexts: IComponentStyles;
      };
      productClaim: {
        root: IComponentStyles;
        text: IComponentStyles;
      };
      pageController: {
        scanOtherProductBox: IComponentStyles;
        productName: IComponentStyles;
        starsBox: IComponentStyles;
      };
      compareDrawer: {
        root: IComponentStyles;
        titleBox: {
          root: IComponentStyles;
          closeButton: IComponentStyles;
          title: IComponentStyles;
        };
      };
      productCompareBox: IComponentStyles;
      compareDetails: {
        backgroundColor: string;
        navigationButtons: IComponentStyles;
        productDescription: IComponentStyles;
        compareItems: IComponentStyles;
        divider: IComponentStyles;
      };

      reviewContent: {
        title: IComponentStyles;
        reviewHeadline: IComponentStyles;
        reviewText: IComponentStyles;
        divider: IComponentStyles;
      };
      buttonPopupContent: {
        root: IComponentStyles;
        title: IComponentStyles;
        closeButton: IComponentStyles;
        content: IComponentStyles;
      };
      beardStyles: {
        root: IComponentStyles;
        title: IComponentStyles;
        counter: IComponentStyles;
      };
      infoMenu: {
        root: IComponentStyles;
        menuButton: IComponentStyles;
        navigationIcons: IComponentStyles;
        tabTitle: IComponentStyles;
        tabContent: IComponentStyles;
        languageOption: IComponentStyles;
      };
    };

    homePageStyles: {
      root: IComponentStyles;
      subtitle: IComponentStyles;
      title: IComponentStyles;
      startButton: IComponentStyles;
    };
    scanPageStyles: {
      color: string;
      foundColor: string;
      qrBoxText: IComponentStyles;
      productFinderButton: IComponentStyles;
      resultText: IComponentStyles;
    };
    productFinderStyles?: {
      answerButtons: IComponentStyles;
      multipleChoicesAnswerButtons: IComponentStyles;
      settingTogglerButton: IComponentStyles;
      settingTogglerButtonSelected: IComponentStyles;
      settingSliderButtonPlaceholder: IComponentStyles;
      showResultsButton: IComponentStyles;
      backToScannerButton: IComponentStyles;
      backToStartButton: IComponentStyles;
      changeSettingsButton: IComponentStyles;
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    background?: {
      cyan?: string;
    };

    fontSetting?: IFont[];

    headerStyles?: {
      root: IComponentStyles;
      logo: IComponentStyles;
      iconButton: IComponentStyles;
    };

    loadingBoxStyles?: IComponentStyles;

    arPageStyles?: {
      loadingScreen: {
        showProductHeadline: boolean;
        root: IComponentStyles;
        titleBox: {
          root: IComponentStyles;
          title: IComponentStyles;
          subtitle: IComponentStyles;
        };
        progressLoadingBar: IComponentStyles;
        mainRatingBox: {
          root: IComponentStyles;
          rating: IComponentStyles;
          text: IComponentStyles;
        };
        ratingBoxes: {
          root: IComponentStyles;
          rating: IComponentStyles;
          text: IComponentStyles;
        };
        reviewTexts: IComponentStyles;
      };
      productClaim: {
        root: IComponentStyles;
        text: IComponentStyles;
      };
      pageController: {
        scanOtherProductBox: IComponentStyles;
        toggleArrowUp: IComponentStyles;
        toggleArrowDown: IComponentStyles;
        button: IComponentStyles;
      };
      compareDrawer: {
        root: IComponentStyles;
        titleBox: {
          root: IComponentStyles;
          closeButton: IComponentStyles;
          title: IComponentStyles;
        };
      };
      productCompareBox: IComponentStyles;
      compareDetails: {
        backgroundColor: string;
        navigationButtons: IComponentStyles;
        productDescription: IComponentStyles;
        compareItems: IComponentStyles;
        divider: IComponentStyles;
      };
      reviewContent: {
        title: IComponentStyles;
        reviewHeadline: IComponentStyles;
        reviewText: IComponentStyles;
        divider: IComponentStyles;
      };
      buttonPopupContent: {
        root: IComponentStyles;
        title: IComponentStyles;
        closeButton: IComponentStyles;
        content: IComponentStyles;
      };
      beardStyles: {
        root: IComponentStyles;
        title: IComponentStyles;
        counter: IComponentStyles;
      };
      infoMenu: {
        root: IComponentStyles;
        navigationIcons: IComponentStyles;
        menuButton: IComponentStyles;
        tabTitle: IComponentStyles;
        tabContent: IComponentStyles;
        languageOption: IComponentStyles;
      };
    };

    homePageStyles?: {
      root: IComponentStyles;
      subtitle: IComponentStyles;
      title: IComponentStyles;
      startButton: IComponentStyles;
    };

    scanPageStyles?: {
      color: string;
      foundColor: string;
      qrBoxText: IComponentStyles;
      productFinderButton: IComponentStyles;
      resultText: IComponentStyles;
    };

    productFinderStyles?: {
      answerButtons: IComponentStyles;
      multipleChoicesAnswerButtons: IComponentStyles;
      settingTogglerButton: IComponentStyles;
      settingTogglerButtonSelected: IComponentStyles;
      settingSliderButtonPlaceholder: IComponentStyles;
      backToScannerButton: IComponentStyles;
      backToStartButton: IComponentStyles;
      changeSettingsButton: IComponentStyles;
      showResultsButton: IComponentStyles;
    };
  }

  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    white: true;
    black: true;
  }

  interface ButtonPropsSizeOverrides {
    extraLarge: true;
  }
}

export interface IAppRoute {
  path: string;
  component: React.FC<any>;
  name?: string;
  exact?: boolean;
}

export interface ExecutionResult<T = never> {
  result: T;
}

export interface ISupportLanguage {
  name: string;
  code: string;
  isDefault: boolean;
}

export interface AppHeaderProps {
  brandName?: string;
  logo?: string;
}

export interface QueryAnswer {
  AnswerText: string;
  Destination: string;
  Products: Array<unknown>;
  Selected?: boolean;
}

export interface QueryQuestion {
  QuestionID: string;
  QuestionTitle: string;
  QuestionAnswer: QueryAnswer[];
}

export interface IFont {
  fontFamily: string;
  fontStyle: string;
  fontWeight: string;
  fontUrl: string;
};

export interface IStore {
  id: string;
  brandId: string;
  brandName: string;
  logo: string;
  coreTheme: { styles: string, fontFamily: string };
  fontSetting: IFont[];
  headerStyles: { styles: string };
  loadingBoxStyles: { styles: string };
  arPageStyles: {
    loadingScreen: { styles: string, showProductHeadline: boolean };
    productClaim: { styles: string };
    pageController: { styles: string };
    compareDrawer: { styles: string };
    productCompareBox: { styles: string };
    compareDetails: { styles: string };
    reviewContent: { styles: string };
    buttonPopupContent: { styles: string };
    beardStyles: { styles: string };
    infoMenu: { styles: string };
  };
  homePage: {
    homePageStyles: { styles: string };
    backgroundVideo?: string;
  };
  scanPageStyles: { styles: string };
  productFinderStyles: { styles: string };
  firstQuestion: {
    _ref: string;
  } | null;
}

interface INamedObject {
  name: string
  val: object
}

export interface IAFrameSceneProps {
  sceneHtml: string
  imageTargets?: string[]
  components?: INamedObject[]
  primitives?: INamedObject[]
}

export interface IComment {
  stars: number;
  headline: string;
  comment: string;
}

// different product types
export interface IProduct {
  id: string;
  name: string;
  productClaim: string;
  productType: ProductTypes;
  arObjectUrl: string;
  alphaVideoUrl: string;
  arModelScale: string;
  alphaVideoBgColor: string;
  alphaVideoScale: string;
  alphaVideoPosition: string;
  image: string | { [key: string]: any; };
  searchImage: string | { [key: string]: any; };
  imageCaption: string;
  categoryId: string;
  brandId: string;
  comments: IComment[];
  ratings: number[];
  bgColor: string;
  fgColor: string;
  productFeaturesDescription: string;
  productFeatures: object[][];
  cubemap: {
    negx: string;
    negy: string;
    negz: string;
    posx: string;
    posy: string;
    posz: string;
  };
  beardStyles: IBeardStyle[];
  productQRCodes?: string[];
}

export interface IButtonContent {
  buttonName: string;
  icon: string;
  popupTitle: string;
  hasAnimation: boolean;
  hasBeardStyles: boolean;
  animationLooping: boolean;
  popupContent: { [key: string]: any; }[];
  sound: string;
  hasOverlay: boolean;
  androidScreenOverlay: string | { [key: string]: any; };
  iosScreenOverlay: string | { [key: string]: any; };

  hasModelOverlay: boolean;
  modelOverlayObjectname: string;
  arModelOverlay: string;
  arModelOverlayPlaytime: number;
  arModelOverlayBgColor: string;
  overlayHideModel: boolean;
  arOverlayPosition: string;
  arOverlayScale: string;
}

export interface ISearchCriteria {
  id: string;
  isMultipleChoices: boolean;
  isSearchable: boolean;
  question: string;
}

export interface ISearchCriteriaValue {
  id: string;
  answer: string;
  criteriaRef: string;
  destination: string;
}

export interface IBeardStyle {
  id: string;
  beardImage: string | { [key: string]: any; };
  faceEffectModel: string;
  faceEffectModelAnchor: string;
  modelPosition: string;
  modelScale: string;
  modelRotation: string;
  popupIcon: string;
  popupTitle: string;
  popupContent: {};
  productButtonName: string;
}

export interface SanityOriginalDataType {
  _id: string;
  _type: DataTypes | string;
  [key: string]: any;
}

/**
 * May not correct
 * Temporary an unified interface for every AFrame elements
*/

export type AFrameElement = HTMLElement & {
  setAttribute: (qualifiedName: string, value: string | object | number | boolean) => any;
  getObject3D: (key: string) => any;
  renderer: any;
  material: any;
  emit: Function;
  click: Function;
}
