import { IProduct } from "src/core/declarations/app";
import client from "./api";
import { getLocalProductById } from "./crud.local";

const useLocalData = process.env.REACT_APP_STATIC_DATA;

const PRODUCT_QUERY_BY_ID = `
*[_type == "product"
  && _id == $productId
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
  productQRCodes,
  'arObjectColors': arObjectColors[]{
    'type': @._type,
    @._type == "color" => {
      'value': @.value
    },
    @._type == "pattern" => {
      'value': @.value.asset->['url'],
      'icon': @.icon.asset->['url']
    }
  },
  'hotspots': hotspots[]{
    ...,
    'text': @.text[$lng]
  }
}
`;

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