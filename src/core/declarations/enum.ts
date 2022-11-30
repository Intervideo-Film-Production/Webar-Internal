export enum StoreStatus {
  empty,
  loading,
  loaded,
}

export enum DataTypes {
  beardStyle = 'beardStyle',
  blockContent = 'blockContent',
  brand = 'brand',
  button = 'button',
  category = 'category',
  categoryconsentLink = 'categoryconsentLink',
  criteriaValue = 'criteriaValue',
  inlineImage = 'inlineImage',
  supportLanguage = 'supportLanguage',
  palette = 'palette',
  product = 'product',
  productCriteria = 'productCriteria',
  qrCode = 'qrCode',
  review = 'review',
  searchCriteria = 'searchCriteria',
  translation = 'translation',
  localeBlockContent = 'localeBlockContent',
  localeJSON = 'localeJSON',
  localeString = 'localeString',
  localeText = 'localeText',
  sanityImageAsset = 'sanity.imageAsset',
  sanityFileAsset = 'sanity.fileAsset',
  homePageContent = 'homePageContent',
}

export enum ProductTypes {
  arObject = 'arObject',
  alphaVideo = 'alphaVideo'
}

export enum ButtonActionTypes {
  DisplayProductFeatures = "DisplayProductFeatures",
  CustomContent = "CustomContent",
  WatchVideo = "WatchVideo",
  Link = "Link",
  GiveACall = "GiveACall",
};
export enum ProductColorTypes {
  color = 'color',
  pattern = 'pattern'
}

export const modelRef = 'ar-model';
