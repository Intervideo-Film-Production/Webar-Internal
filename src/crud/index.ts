// export const GET_TRANSLATION_QUERY = `*[_type=="translation"&&brand->['_id']==$brandId][0]['translate'][$language]`;
export const GET_TRANSLATION_QUERY = `*[_type=="translation"]{'brandId': brand->['_id'],'translation': translate[$language]}`;

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

export { findMatchingProducts } from './findMatchingProducts';
export { getAllProductsByQRCode } from './getAllProductsByQRCode';
export { getButtonAnimationContent } from './getButtonAnimationContent';
export { getCompareProducts } from './getCompareProducts';
export { getFirstProductQRCodes } from './getFirstProductQRCodes';
export { getProduct } from './getProduct';
export { getProductById } from './getProductById';
export { getProductComments } from './getProductComments';
export { getQRCodeData } from './getQRCodeData';
export { getSupportLanguages } from './getSupportLanguages';
export { getSearchCriteria, getSearchCriteriaValues } from './searchCriteria';