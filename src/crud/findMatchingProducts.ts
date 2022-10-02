import { IProduct } from "src/core/declarations/app";
import client from "./api";
import { findLocalMatchingProducts } from "./crud.local";

const useLocalData = process.env.REACT_APP_STATIC_DATA;

const PRODUCT_FINDER_QUERY = (searchParamsCount: number) => `
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