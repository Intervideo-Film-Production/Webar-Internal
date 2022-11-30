import { IComment } from "src/core/declarations/app";
import client from "./api";
import { getLocalProductComments } from "./crud.local";

const useLocalData = process.env.REACT_APP_STATIC_DATA;

const PRODUCT_REVIEW_QUERY = `
*[_type=="review" && product['_ref'] == $productId] | order(_updatedAt desc) {
  stars,
  headline,
  comment
}
`
export const getProductComments = (productId: string) => {
  return useLocalData !== 'TRUE'
    ? client.fetch<IComment[]>(PRODUCT_REVIEW_QUERY, { productId })
    : getLocalProductComments(productId);
}
