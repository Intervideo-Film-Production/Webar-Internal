import {
  IQRCodeData,
  IProduct,
  IComment,
  IButtonContent,
  ISearchCriteria,
  ISearchCriteriaValue,
  ISupportLanguage
} from 'src/core/declarations/app';
import {
  getLocalSupportLanguages,
  getLocalQRCodeData,
  getLocalProductByQrCode,
  getLocalProductById,
  getLocalProductComments,
  getLocalCompareProducts,
  getLocalButtonAnimationContent,
  getLocalSearchCriteria,
  getLocalSearchCriteriaValues,
  findLocalMatchingProducts,
  getLocalFirstProductQRCode,
  getAllLocalProductsByQrCode
} from './crud.local';
import client from './api';

const useLocalData = process.env.REACT_APP_STATIC_DATA;
// FIXME fix static data
export const GET_SUPPORT_LANGUAGES = `
  *[_type == "supportLanguage" && isDisabled != true]{
    code,
    isDefault,
    name
  }
`;

// export const GET_TRANSLATION_QUERY = `*[_type=="translation"&&brand->['_id']==$brandId][0]['translate'][$language]`;
export const GET_TRANSLATION_QUERY = `*[_type=="translation"]{'brandId': brand->['_id'],'translation': translate[$language]}`;

// FIXME handle static data for fontSetting
export const QRCODE_QUERY = `*[_type=="qrCode" && qrValue == $qrValue]{
    'id': _id,
    ...brand->{
    "logo": logo["asset"]->["url"],
    'brandId': @._id,
    brandName,
    coreTheme,
    'fontSetting': fontSetting.fontCollections[]{
      'fontFamily': @.fontFamily,
      'fontStyle': @.fontStyle,
      'fontWeight': @.fontWeight,
      'fontUrl': @.fontFile.asset->['url'],
    },
    headerStyles,
    loadingBoxStyles,
    arPageStyles,
    'homePage': {
      'homePageStyles': homePage.homePageStyles,
      'backgroundVideo': homePage.backgroundVideo.asset->['url']
    },
    scanPageStyles,
    productFinderStyles
  },
  firstQuestion
}`;

export const PRODUCT_QUERY = `
  *[_type == "product" 
  && $qrValue in productQRCodes 
  && isDisabled != true 
  && _id in *[_type =="qrCode" && @._id == $qrCodeId][0].productList[]._ref
]{
    'id': _id,
    'name': name[$lng],
    'productClaim': productClaim[$lng],
    'arObjectUrl': arObject.asset->['url'],
    arModelScale,
    'image': productImage.asset->['url'],
    searchImage,
    'imageCaption': productImageCaption[$lng],
    "ratings": *[_type == 'review' && references(^._id)].stars,
    'comments': *[_type == 'review' && references(^._id)] | order(stars desc)[0..2]{
      stars,
      comment
    },
    'categoryId': categories->['_id'],
    'brandId': brand->['_id'],
    bgColor,
    fgColor,
    productQRCodes,
    'productFeaturesDescription': productFeatures.productFeatureDescription[$lng],
    'productFeatures': productFeatures.productFeatureItem[][$lng],
    'beardStyles': *[_type == 'beardStyle' && product._ref == ^._id]{
      'id': @['_id'],
      'beardImage': beardImage.asset->['url'],
      'popupIcon': popupIcon.asset->['url'],
      'popupTitle': popupTitle[$lng],
      'popupContent': popupContent[$lng],
      'productButtonName': productButton->['buttonName']
    }
  }
`;

export const PRODUCT_QUERY_BY_ID = `
  *[_type == "product"
    && _id == $productId
    && isDisabled != true
    && _id in *[_type =="qrCode" && @._id == $qrCodeId][0].productList[]._ref
]{
    'id': _id,
    'name': name[$lng],
    'productClaim': productClaim[$lng],
    'arObjectUrl': arObject.asset->['url'],
    arModelScale,
    'image': productImage.asset->['url'],
    searchImage,
    'imageCaption': productImageCaption[$lng],
    "ratings": *[_type == 'review' && references(^._id)].stars,
    'comments': *[_type == 'review' && references(^._id)] | order(stars desc)[0..2]{
      stars,
      comment
    },
    'categoryId': categories->['_id'],
    'brandId': brand->['_id'],
    bgColor,
    fgColor,
    'productFeaturesDescription': productFeatures.productFeatureDescription[$lng],
    'productFeatures': productFeatures.productFeatureItem[][$lng],
    'cubemap':{
      'negx': productCubemap.negx.asset->["url"],
      'negy': productCubemap.negy.asset->["url"],
      'negz': productCubemap.negz.asset->["url"],
      'posx': productCubemap.posx.asset->["url"],
      'posy': productCubemap.posy.asset->["url"],
      'posz': productCubemap.posz.asset->["url"]
    },
    'beardStyles': *[_type == 'beardStyle' && product._ref == ^._id]{
      'id': @['_id'],
      'beardImage': beardImage.asset->['url'],
      'popupIcon': popupIcon.asset->['url'],
      'popupTitle': popupTitle[$lng],
      'popupContent': popupContent[$lng],
      'productButtonName': productButton->['buttonName']
    },
    productQRCodes
  }
`;

export const PRODUCT_QUERY_BY_QRCODE = `
*[_type == "product"
  && isDisabled != true
  && _id in *[_type =="qrCode" && @._id == $qrCodeId][0].productList[]._ref
]{
  'id': _id,
  'name': name[$lng],
  'productClaim': productClaim[$lng],
  'arObjectUrl': arObject.asset->['url'],
  arModelScale,
  'image': productImage.asset->['url'],
  searchImage,
  'imageCaption': productImageCaption[$lng],
  "ratings": *[_type == 'review' && references(^._id)].stars,
  'comments': *[_type == 'review' && references(^._id)] | order(stars desc)[0..2]{
    stars,
    comment
  },
  'categoryId': categories->['_id'],
  'brandId': brand->['_id'],
  bgColor,
  fgColor,
  'productFeaturesDescription': productFeatures.productFeatureDescription[$lng],
  'productFeatures': productFeatures.productFeatureItem[][$lng],
  'beardStyles': *[_type == 'beardStyle' && product._ref == ^._id]{
    'id': @['_id'],
    'beardImage': beardImage.asset->['url'],
    'popupIcon': popupIcon.asset->['url'],
    'popupTitle': popupTitle[$lng],
    'popupContent': popupContent[$lng],
    'productButtonName': productButton->['buttonName']
  },
  productQRCodes
}
`;

export const PRODUCT_REVIEW_QUERY = `
  *[_type=="review" && product['_ref'] == $productId] | order(_updatedAt desc) {
    stars,
    headline,
    comment
  }
`

export const COMPARE_PRODUCTS_QUERY = `
  *[_type == "product" 
    && _id != $productId 
    && isDisabled != true
    && categories["_ref"] == $categoryId
    && _id in *[_type =="qrCode" && @._id == $qrCodeId][0].productList[]._ref
  ]{
    'id': _id,
    'name': name[$lng],
    searchImage,
    bgColor
  }
`

export const BUTTON_ANIMATION_CONTENT_QUERY = `
  *[_type=="button" && product['_ref'] == $productId]{
    buttonName,
    'popupTitle': popupTitle[$lng],
    'popupContent': popupContent[$lng][]{
      ...,
      _type=='file' => {
      'url': @.asset->['url']
      },
      _type=='image' => {
        'url': @.asset->['url']
      }
    },
    hasBeardStyles,
    hasAnimation,
    animationLooping,
    'icon': icon.asset->url,
    'sound': sound.asset->["url"],
    hasOverlay,
    'androidScreenOverlay': androidScreenOverlay.asset->['url'],
    'iosScreenOverlay': iosScreenOverlay.asset->['url'],
    hasModelOverlay,
    modelOverlayObjectname,
    'arModelOverlay': arModelOverlay.asset->['url'],
    arModelOverlayPlaytime,
    arModelOverlayBgColor,
    overlayHideModel,
    arOverlayPosition,
    arOverlayScale
  }
`;

export const SEARCH_CRITERIA_QUERY = `
  *[_type == 'searchCriteria']{
    'id': _id,
    isMultipleChoices,
    isSearchable,
    'question': question[$lng]
  }
`;

export const CRITERIA_VALUE_QUERY = `
  *[_type == 'criteriaValue']{
    'id': _id,
    'answer': answer[$lng],
    'criteriaRef': criteria._ref,
    'destination': destination._ref
  }
`;

export const PRODUCT_FINDER_QUERY = (searchParamsCount: number) => `
*[_type=="product"
  && isDisabled != true
  && _id in *[_type =="qrCode" && @._id == $qrCodeId][0].productList[]._ref
  ${Array(searchParamsCount).fill(null).map((_, i) => (
  `
  && defined(searchCriteria[@.criteria._ref == $questionId${i}
    && select(
    @.isMultipleChoices == true => count(@.criteriaValueArray[@._ref in [$answerId${i}]]) > 0,
    @.criteriaValue._ref == $answerId${i}
    )][0])
  `)).join(' ')}
 ]{
  'id': _id,
  'name': name[$lng],
  'productClaim': productClaim[$lng],
  'arObjectUrl': arObject.asset->['url'],
  arModelScale,
  'image': productImage.asset->['url'],
  searchImage,
  'imageCaption': productImageCaption[$lng],
  "ratings": *[_type == 'review' && references(^._id)].stars,
  'comments': *[_type == 'review' && references(^._id)] | order(stars desc)[0..2]{
    stars,
    comment
  },
  'categoryId': categories->['_id'],
  'brandId': brand->['_id'],
  bgColor,
  fgColor,
  'productFeaturesDescription': productFeatures.productFeatureDescription[$lng],
  'productFeatures': productFeatures.productFeatureItem[][$lng],
  'beardStyles': *[_type == 'beardStyle' && product._ref == ^._id]{
    'id': @['_id'],
    'beardImage': beardImage.asset->['url'],
    'popupIcon': popupIcon.asset->['url'],
    'popupTitle': popupTitle[$lng],
    'popupContent': popupContent[$lng],
    'productButtonName': productButton->['buttonName']
  }
}
 `;

export const FIRST_PRODUCT_QR_CODE_QUERY = `
  *[_type=='product' 
    && isDisabled != true
    && _id in *[_type =="qrCode" && @._id == $qrCodeId][0].productList[]._ref
  ]{
    'qr': productQRCodes[0]
  }.qr
`;

/**
 * Get a list of supported languages by the system
 * @returns 
 */
export const getSupportLanguages = () => {
  return useLocalData !== 'TRUE'
    ? client.fetch<ISupportLanguage[]>(GET_SUPPORT_LANGUAGES)
    : getLocalSupportLanguages()
}

/**
 * get data associated with a `store` QR code
 * @param qrValue 
 * @returns 
 */
export const getQRCodeData = (qrValue: string) => {
  return useLocalData !== 'TRUE'
    ? client.fetch<IQRCodeData[]>(QRCODE_QUERY, { qrValue: qrValue }).then(res => res[0])
    : getLocalQRCodeData(qrValue);
}

/**
 * Get a specific product by associated qr code
 * @param qrValue 
 * @param lng 
 * @param qrCodeId 
 * @returns 
 */
export const getProduct = (qrValue: string, lng: string, qrCodeId: string): Promise<IProduct | null> => {
  return useLocalData !== 'TRUE'
    ? client.fetch<IProduct[]>(PRODUCT_QUERY, { qrValue, lng, qrCodeId }).then(res => res.length === 0 ? null : res[0])
    : getLocalProductByQrCode(qrValue, lng, qrCodeId)
}

/**
 * Get a specific product by id
 * @param productId 
 * @param lng 
 * @param qrCodeId 
 * @returns 
 */
export const getProductById = (productId: string, lng: string, qrCodeId: string): Promise<IProduct | null> => {
  return useLocalData !== 'TRUE'
    ? client.fetch<IProduct[]>(PRODUCT_QUERY_BY_ID, { productId, lng, qrCodeId }).then(res => res.length === 0 ? null : res[0])
    : getLocalProductById(productId, lng, qrCodeId);
}

export const getAllProductsByQRCode = (qrCodeId: string, lng: string): Promise<IProduct[] | null> => {
  return useLocalData !== 'TRUE'
    ? client.fetch<IProduct[]>(PRODUCT_QUERY_BY_QRCODE, { qrCodeId, lng })
    : getAllLocalProductsByQrCode();
}

/**
 * Find products to compare with a specific product
 * @param productId id of project to compare
 * @param qrCodeId  
 * @param categoryId 
 * @param lng 
 * @returns list of products of the same category and qrCode
 */
export const getCompareProducts = (productId: string, qrCodeId: string, categoryId: string, lng: string): Promise<IProduct[] | null> => {
  return useLocalData !== 'TRUE'
    ? client.fetch<IProduct[]>(COMPARE_PRODUCTS_QUERY, { productId, qrCodeId, categoryId, lng })
    : getLocalCompareProducts(productId, qrCodeId, categoryId, lng);
}

/**
 * Find product lists base on search criteria
 * @param params 
 * @param lng 
 * @param qrCodeId 
 * @returns 
 */

export const findMatchingProducts = (params: { questionId: string, answerId: string | string[] }[], lng: string, qrCodeId: string) => {
  // filter empty answers
  const questions = params.filter(q => !(Array.isArray(q.answerId) && q.answerId.length === 0));

  return useLocalData !== 'TRUE'
    ? client.fetch<IProduct[]>(PRODUCT_FINDER_QUERY(questions.length), questions.reduce((a, b, i) => ({
      ...a,
      [`questionId${i}`]: b.questionId,
      [`answerId${i}`]: b.answerId,
    }), { lng, qrCodeId }))
    : findLocalMatchingProducts(questions.reduce((a, b, i) => ({
      ...a,
      [`questionId${i}`]: b.questionId,
      [`answerId${i}`]: b.answerId,
    }), {}), lng, qrCodeId)
}

export const getProductComments = (productId: string) => {
  return useLocalData !== 'TRUE'
    ? client.fetch<IComment[]>(PRODUCT_REVIEW_QUERY, { productId })
    : getLocalProductComments(productId);
}

// AR Button content

export const getButtonAnimationContent = (productId: string, lng: string): Promise<IButtonContent[] | null> => {
  return useLocalData !== 'TRUE'
    ? client.fetch<IButtonContent[]>(BUTTON_ANIMATION_CONTENT_QUERY, { productId, lng })
    : getLocalButtonAnimationContent(productId, lng);
}

// Search criteria

export const getSearchCriteria = (lng: string) => {
  return useLocalData !== 'TRUE'
    ? client.fetch<ISearchCriteria[]>(SEARCH_CRITERIA_QUERY, { lng })
    : getLocalSearchCriteria(lng);
}

export const getSearchCriteriaValues = (lng: string) => {
  return useLocalData !== 'TRUE'
    ? client.fetch<ISearchCriteriaValue[]>(CRITERIA_VALUE_QUERY, { lng })
    : getLocalSearchCriteriaValues(lng);
}

/**
 * image targets should be named as the first qr code in the code list to ensure that the scanning image target works properly
*/
export const getFirstProductQRCodes = (qrCodeId: string) => {
  return useLocalData !== 'TRUE'
    ? client.fetch<string[]>(FIRST_PRODUCT_QR_CODE_QUERY, { qrCodeId })
    : getLocalFirstProductQRCode(qrCodeId);
}

/**
 * simple http requests to log issues
*/

export const checkIssue = (issue: any) => {
  var url = "https://webar-wip-data.com/log-bug";
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ data: issue }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
}
