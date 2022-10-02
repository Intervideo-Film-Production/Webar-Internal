import { IProduct } from "src/core/declarations/app";
import client from "./api";
import { getAllLocalProductsByQrCode } from "./crud.local";

const useLocalData = process.env.REACT_APP_STATIC_DATA;

const PRODUCT_QUERY_BY_QRCODE = `
*[_type == "product"
  && isDisabled != true
  && _id in *[_type =="qrCode" && @._id == $qrCodeId][0].productList[]._ref
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
  },
  productQRCodes
}
`;

export const getAllProductsByQRCode = (qrCodeId: string, lng: string): Promise<IProduct[] | null> => {
  return useLocalData !== 'TRUE'
    ? client.fetch<IProduct[]>(PRODUCT_QUERY_BY_QRCODE, { qrCodeId, lng })
    : getAllLocalProductsByQrCode();
}