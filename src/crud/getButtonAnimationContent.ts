import { IButtonContent } from "src/core/declarations/app";
import client from "./api";
import { getLocalButtonAnimationContent } from "./crud.local";

const useLocalData = process.env.REACT_APP_STATIC_DATA;

const BUTTON_ANIMATION_CONTENT_QUERY = `
*[_type=="button" && product['_ref'] == $productId]{
  buttonName,
  actionType,
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
  arOverlayScale,
  modelOverlayObjectname,
  'arModelOverlay': arModelOverlay[$lng].asset->['url'],
  arModelOverlayPlaytime,
  arModelOverlayBgColor,
  overlayHideModel,
  arOverlayPosition,
  'videoContent': videoContent[$lng].asset->['url'],
  'customContent': customContent[$lng],
  link,
  phoneNumber
}
`;

// AR Button content

export const getButtonAnimationContent = (productId: string, lng: string): Promise<IButtonContent[] | null> => {
  return useLocalData !== 'TRUE'
    ? client.fetch<IButtonContent[]>(BUTTON_ANIMATION_CONTENT_QUERY, { productId, lng })
    : getLocalButtonAnimationContent(productId, lng);
}
