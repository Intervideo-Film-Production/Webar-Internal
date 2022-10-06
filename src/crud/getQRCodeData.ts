import { IQRCodeData } from "src/core/declarations/app";
import client from "./api";
import { getLocalQRCodeData } from "./crud.local";

const useLocalData = process.env.REACT_APP_STATIC_DATA;

// FIXME handle static data for fontSetting
const QRCODE_QUERY = `*[_type=="qrCode" && qrValue == $qrValue]{
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
