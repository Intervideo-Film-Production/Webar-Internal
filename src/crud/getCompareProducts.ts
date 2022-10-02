import { IProduct } from "src/core/declarations/app";
import client from "./api";
import { getLocalCompareProducts } from "./crud.local";

const useLocalData = process.env.REACT_APP_STATIC_DATA;

const COMPARE_PRODUCTS_QUERY = `
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
`;

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
