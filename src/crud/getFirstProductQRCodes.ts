import client from "./api";
import { getLocalFirstProductQRCode } from "./crud.local";

const useLocalData = process.env.REACT_APP_STATIC_DATA;

const FIRST_PRODUCT_QR_CODE_QUERY = `
*[_type=='product' 
  && isDisabled != true
  && _id in *[_type =="qrCode" && @._id == $qrCodeId][0].productList[]._ref
]{
  'qr': productQRCodes[0]
}.qr
`;

/**
 * image targets should be named as the first qr code in the code list to ensure that the scanning image target works properly
*/
export const getFirstProductQRCodes = (qrCodeId: string) => {
  return useLocalData !== 'TRUE'
    ? client.fetch<string[]>(FIRST_PRODUCT_QR_CODE_QUERY, { qrCodeId })
    : getLocalFirstProductQRCode(qrCodeId);
}