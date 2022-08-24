/**
 * These are APIs to fetch data from data.json file which should be available if develop
 * choose to deploy the project with without connection to Sanity.
 * All data and assets should be available and should be checked to ensure the client works
 * // TODO
 * Any missing data or assets will be notified as a server error from UX point of view and should be logged to data provider server
*/

import { DataTypes } from 'src/core/declarations/enum';
import { map, from, lastValueFrom } from 'rxjs';
import { SanityOriginalDataType, ISupportLanguage, IQRCodeData, IProduct, IComment, IButtonContent, ISearchCriteria, ISearchCriteriaValue, IFont, IBeardStyle } from 'src/core/declarations/app';

const getLocalData = () => {
  return from<Promise<SanityOriginalDataType[]>>(fetch('sourceData/data.json')
    .then(data => data.json())
    .catch(err => {
      console.error(err)
    }))
}

const localDataTransform = <T>(projector: (data: SanityOriginalDataType[]) => T) => getLocalData()
  .pipe(
    map(d => projector(d)),
  );

export const getLocalSupportLanguages = () => {
  return lastValueFrom(
    localDataTransform<ISupportLanguage[]>(data =>
      data.filter(d => d._type === DataTypes.supportLanguage && d.isDisabled === false)
        .map<ISupportLanguage>(({ code, isDefault, name }) => ({ code, isDefault, name }))
    )
  )
}

export const getLocalQRCodeData = (qrValue: string) => {
  return lastValueFrom(
    localDataTransform<IQRCodeData | null>(data => {

      const qrCode = data.find(d => d._type === DataTypes.qrCode && d.qrValue === qrValue);
      const brandData = data.find(b => b._type === DataTypes.brand && b._id === qrCode?.brand._ref);
      const brandImage = data.find(d => d._type === DataTypes.sanityImageAsset && d._id === brandData?.logo.asset._ref);
      const backgroundVideo = data.find(d => d._type === DataTypes.sanityFileAsset && d._id === brandData?.homePage?.backgroundVideo?.asset?._ref);
      let fontSetting = brandData?.fontSetting.fontCollections?.map((font: any) => ({
        ...font,
        fontUrl: `./sourceData${data.find(_d => _d._type === DataTypes.sanityFileAsset && _d._id === font.fontFile.asset._ref)?.localUrl}`
      }))

      return qrCode && brandData ? {
        id: qrCode?._id,
        brandId: brandData?._id,
        logo: `./sourceData${brandImage?.localUrl}`,
        brandName: brandData?.brandName,
        palette: brandData?.palette,
        backgroundColor: brandData?.backgroundColor,
        coreTheme: brandData?.coreTheme,
        fontSetting: fontSetting,
        headerStyles: brandData?.headerStyles,
        loadingBoxStyles: brandData?.loadingBoxStyles,
        arPageStyles: brandData?.arPageStyles,
        homePage: {
          homePageStyles: brandData?.homePage.homePageStyles,
          backgroundVideo: !!backgroundVideo ? `./sourceData${backgroundVideo?.localUrl}` : ''
        },
        scanPageStyles: brandData?.scanPageStyles,
        productFinderStyles: brandData?.productFinderStyles,
        firstQuestion: qrCode?.firstQuestion
      } : null;
    })
  )
}

const getLocalProduct = (predicate: (product: SanityOriginalDataType) => boolean, lng: string, qrCodeId: string, brandId?: string) => {
  return lastValueFrom(
    localDataTransform<IProduct | null>(data => {
      const product = data.find(d => d._type === DataTypes.product
        && !d.isDisabled
        && (!!brandId ? d.brand._ref === brandId : true)
        && !!data.find(_d => _d._type === DataTypes.qrCode && _d._id === qrCodeId)?.productList?.find((pRef: any) => pRef._ref === d._id)
        && predicate(d));
      if (!product) return null;

      const arObject = data.find(d => d._type === DataTypes.sanityFileAsset && d._id === product?.arObject.asset._ref);
      const productImage = data.find(d => d._type === DataTypes.sanityImageAsset && d._id === product?.productImage.asset._ref);
      const beardStyles = data.filter(d => d._type === DataTypes.beardStyle && d.product._ref === product?._id)
        .map(bs => ({
          id: bs?._id,
          beardImage: `./sourceData${data.find(_d => _d._type === DataTypes.sanityImageAsset && _d._id === bs?.beardImage.asset._ref)?.localUrl}`,
          popupIcon: `./sourceData${data.find(_d => _d._type === DataTypes.sanityImageAsset && _d._id === bs?.popupIcon.asset._ref)?.localUrl}`,
          popupTitle: bs?.popupTitle ? bs?.popupTitle[lng] : '',
          popupContent: bs?.popupContent ? bs?.popupContent[lng] : null,
          productButtonName: data.find(_d => _d._type === DataTypes.button && _d._id === bs?.productButton._ref)?.buttonName,
        })) as IBeardStyle[];

      const reviews = data.filter(d => d._type === DataTypes.review && d.product._ref === product?._id);

      const productFeatures = product?.productFeatures?.productFeatureItem?.map((pfi: any) => {
        const localizedPF = pfi[lng];

        return localizedPF.map((b: any) => {
          if (b._type === 'inlineImage') {
            b.imageArray.map((a: any) => {
              a.url = `./sourceData${data.find(_d => _d._type === DataTypes.sanityImageAsset && _d._id === a.image.asset._ref)?.localUrl}`;
              return a;
            })
          }

          return b;
        })
      });

      const searchImage = {
        ...product?.searchImage,
        url: `./sourceData${data.find(d => d._type === DataTypes.sanityImageAsset && d._id === product?.searchImage.asset._ref)?.localUrl}`
      }

      return {
        id: product?._id as string,
        name: product?.name[lng],
        productClaim: product?.productClaim[lng],
        arObjectUrl: `./sourceData${arObject?.localUrl}`,
        image: `./sourceData${productImage?.localUrl}`,
        searchImage: searchImage,
        imageCaption: product?.productImageCaption ? product?.productImageCaption[lng] : '',
        ratings: reviews?.map(r => r.stars),
        comments: reviews?.sort((a, b) => a.stars - b.stars).map(({ stars, comment }) => ({ stars, comment } as IComment)).slice(0, 3),
        categoryId: product?.categories._ref,
        brandId: product?.brand._ref,
        bgColor: product?.bgColor,
        fgColor: product?.fgColor,
        productFeaturesDescription: product?.productFeatures?.productFeatureDescription ? product?.productFeatures?.productFeatureDescription[lng] : '',
        productFeatures: productFeatures,
        beardStyles: beardStyles,
        productQRCodes: product?.productQRCodes
      }
    })
  )
}

const getLocalProductList = (predicate: (product: SanityOriginalDataType) => boolean, lng: string, qrCodeId: string) => {
  return lastValueFrom(
    localDataTransform<IProduct[] | null>(data => {
      const products = data.filter(d => d._type === DataTypes.product
        && !d.isDisabled
        && !!data.find(_d => _d._type === DataTypes.qrCode && _d._id === qrCodeId)?.productList?.find((pRef: any) => pRef._ref === d._id)
        && predicate(d));
      if (!products || products.length === 0) return null;

      return products.map(product => {
        const arObject = data.find(d => d._type === DataTypes.sanityFileAsset && d._id === product?.arObject.asset._ref);
        const productImage = data.find(d => d._type === DataTypes.sanityImageAsset && d._id === product?.productImage.asset._ref);
        const beardStyles = data.filter(d => d._type === DataTypes.beardStyle && d.product._ref === product?._id)
          .map(bs => ({
            id: bs?._id,
            beardImage: `./sourceData${data.find(_d => _d._type === DataTypes.sanityImageAsset && _d._id === bs?.beardImage.asset._ref)?.localUrl}`,
            popupIcon: `./sourceData${data.find(_d => _d._type === DataTypes.sanityImageAsset && _d._id === bs?.popupIcon.asset._ref)?.localUrl}`,
            popupTitle: bs?.popupTitle ? bs?.popupTitle[lng] : '',
            popupContent: bs?.popupContent ? bs?.popupContent[lng] : null,
            productButtonName: data.find(_d => _d._type === DataTypes.button && _d._id === bs?.productButton._ref)?.buttonName,
          })) as IBeardStyle[];

        const reviews = data.filter(d => d._type === DataTypes.review && d.product._ref === product?._id);


        const searchImage = {
          ...product?.searchImage,
          url: `./sourceData${data.find(d => d._type === DataTypes.sanityImageAsset && d._id === product?.searchImage.asset._ref)?.localUrl}`
        }

        return {
          id: product?._id as string,
          name: product?.name[lng],
          productClaim: product?.productClaim[lng],
          arObjectUrl: `./sourceData${arObject?.localUrl}`,
          image: `./sourceData${productImage?.localUrl}`,
          searchImage: searchImage,
          imageCaption: product?.productImageCaption ? product?.productImageCaption[lng] : '',
          ratings: reviews?.map(r => r.stars),
          comments: reviews?.sort((a, b) => a.stars - b.stars).map(({ stars, comment }) => ({ stars, comment } as IComment)).slice(0, 3),
          categoryId: product?.categories._ref,
          brandId: product?.brand._ref,
          bgColor: product?.bgColor,
          fgColor: product?.fgColor,
          productFeaturesDescription: product?.productFeatures?.productFeatureDescription ? product?.productFeatures?.productFeatureDescription[lng] : '',
          productFeatures: product?.productFeatures?.productFeatureItem?.map((pfi: any) => pfi[lng]),
          beardStyles: beardStyles
        }
      })
    })
  )
}

export const getLocalProductByQrCode = (qrValue: string, lng: string, qrCodeId: string) => getLocalProduct(
  p => p.productQRCodes.includes(qrValue),
  lng,
  qrCodeId
);

export const getLocalProductById = (productId: string, lng: string, qrCodeId: string) => getLocalProduct(
  p => p._id === productId,
  lng,
  qrCodeId
);

export const getAllLocalProductsByQrCode = (): Promise<IProduct[]> => {
  return new Promise((resolve) => resolve([]));
};

export const getProductUrlsInCategory = (categoryId: string) => lastValueFrom(
  localDataTransform<Pick<IProduct, 'arObjectUrl' | 'id'>[]>(data => {
    const products = data
      .filter(p => p._type === DataTypes.product && p.categories._ref === categoryId);


    return products.map((product) => {
      const arObject = data.find(d => d._type === DataTypes.sanityFileAsset && d._id === product?.arObject.asset._ref);

      return {
        id: product._id,
        arObjectUrl: `./sourceData${arObject?.localUrl}`,
      }
    })
  })
)

export const getLocalProductComments = (productId: string) => {
  return lastValueFrom(
    localDataTransform<IComment[]>(data => data.filter(d => d._type === DataTypes.review && d.product._ref === productId)
      .sort((a, b) => (a._updatedAt as string).localeCompare(b._updatedAt as string))
      .map(({ stars, headline, comment }) => ({ stars, headline, comment }))
    )
  )
}

export const getLocalCompareProducts = (productId: string, qrCodeId: string, categoryId: string, lng: string) => {
  return lastValueFrom(
    localDataTransform<IProduct[]>(data => data.filter(d => d._type === DataTypes.product &&
      d._id !== productId &&
      !d.isDisabled &&
      d.categories._ref === categoryId &&
      !!data.find(_d => _d._type === DataTypes.qrCode && _d._id === qrCodeId)?.productList?.find((pRef: any) => pRef._ref === d._id)
    )
      .map(({ _id, name, searchImage, bgColor }) => {
        const searchImageUrl = searchImage
          ? {
            ...searchImage,
            url: `./sourceData${data.find(d => d._type === DataTypes.sanityImageAsset && d._id === searchImage.asset._ref)?.localUrl}`
          }
          : null;
        return {
          id: _id,
          name: name[lng] ? name[lng] : name['en'],
          searchImage: searchImageUrl,
          bgColor
        } as IProduct
      })
    )
  )
}

export const getLocalButtonAnimationContent = (productId: string, lng: string) => {
  return lastValueFrom(
    localDataTransform<IButtonContent[]>(data => data.filter(d => d._type === DataTypes.button && d.product._ref === productId)
      .map(b => {
        let btnContent = b.popupContent ? b.popupContent[lng] : null;

        if (btnContent) {
          btnContent = btnContent.map((block: any) => {
            if (block._type === 'file' || block._type === 'image') {
              if (!block.asset || !block.asset._ref) return null;
              const url = `./sourceData${data.find(d => d._type === (block._type === 'file' ? DataTypes.sanityFileAsset : DataTypes.sanityImageAsset)
                && d._id === block.asset._ref)?.localUrl}`;

              const previewImageUrl = block.previewImage ? `./sourceData${data.find(d => d._type === DataTypes.sanityImageAsset && d._id === block.previewImage.asset._ref)?.localUrl}` : null;
              return {
                ...block,
                url,
                previewImage: previewImageUrl ? {
                  ...block.previewImage,
                  url: previewImageUrl
                } : null
              }
            } else {
              return block
            }
          })
        };

        const btnIcon = b.icon
          ? `./sourceData${data.find(d => d._type === DataTypes.sanityImageAsset && d._id === b.icon.asset._ref)?.localUrl}`
          : '';
        const androidScreenOverlay = b.androidScreenOverlay
          ? `./sourceData${data.find(d => d._type === DataTypes.sanityFileAsset && d._id === b.androidScreenOverlay.asset._ref)?.localUrl}`
          : '';
        const iosScreenOverlay = b.iosScreenOverlay
          ? `./sourceData${data.find(d => d._type === DataTypes.sanityFileAsset && d._id === b.iosScreenOverlay?.asset._ref)?.localUrl}`
          : '';
        const arModelOverlay = b.arModelOverlay
          ? `./sourceData${data.find(d => d._type === DataTypes.sanityFileAsset && d._id === b.arModelOverlay?.asset._ref)?.localUrl}`
          : '';

        return {
          buttonName: b.buttonName,
          popupTitle: b.popupTitle ? b.popupTitle[lng] : null,
          popupContent: btnContent,
          hasBeardStyles: b.hasBeardStyles,
          hasAnimation: b.hasAnimation,
          animationLooping: b.animationLooping,
          icon: btnIcon,
          // TODO
          sound: '',
          hasOverlay: b.hasOverlay,
          androidScreenOverlay,
          iosScreenOverlay,
          hasModelOverlay: b.hasModelOverlay,
          modelOverlayObjectname: b.modelOverlayObjectname,
          arModelOverlay,
          arModelOverlayPlaytime: b.arModelOverlayPlaytime,
          arModelOverlayBgColor: b.arModelOverlayBgColor
        }
      })
    )
  )
}

export const getLocalSearchCriteria = (lng: string) => {
  return lastValueFrom(
    localDataTransform<ISearchCriteria[]>(data => data.filter(d => d._type === DataTypes.searchCriteria)
      .map(({ _id, isMultipleChoices, isSearchable, question, isStart }) => ({
        id: _id,
        isMultipleChoices, isSearchable,
        question: question[lng]
      }))
    )
  )
}

export const getLocalSearchCriteriaValues = (lng: string) => {
  return lastValueFrom(
    localDataTransform<ISearchCriteriaValue[]>(data => data.filter(d => d._type === DataTypes.criteriaValue)
      .map(({ _id, answer, criteria, destination }) => ({
        id: _id,
        answer: answer[lng],
        criteriaRef: criteria?._ref,
        destination: destination?._ref
      }))
    )
  )
}

export const findLocalMatchingProducts = (questionsObject: { [key: string]: any }, lng: string, qrCodeId: string) => getLocalProductList(
  product => {
    const criterias = Object.keys(questionsObject).filter(k => k.includes('questionId'));

    return criterias.every(c => {
      const cvKeyIdx = /\d+/.exec(c);
      const cvKey = !!cvKeyIdx ? `answerId${cvKeyIdx[0]}` : null;
      const existSC = product?.searchCriteria?.find((_sc: any) => _sc?.criteria._ref === questionsObject[c]);
      const existSCV = cvKey ? questionsObject[cvKey] : null;
      if (!!existSC?.isMultipleChoices && !!existSC?.criteriaValueArray) {
        const criteriaValueExist = existSC.criteriaValueArray.find((scv: any) => scv._ref === existSCV);

        return existSC && existSCV && criteriaValueExist;
      } else {
        return existSC && existSCV && existSC.criteriaValue._ref === existSCV;
      }
    })
  },
  lng,
  qrCodeId
);

export const getLocalFirstProductQRCode = (qrCodeId: string) => {
  return lastValueFrom(
    localDataTransform<string[]>(data => data.filter(d => d._type === DataTypes.product
      && !d.isDisabled
      && !!data.find(_d => _d._type === DataTypes.qrCode && _d._id === qrCodeId)?.productList?.find((pRef: any) => pRef._ref === d._id)
    )
      .map(({ productQRCodes }) => productQRCodes[0])
    )
  )
}

//============= return local data export date for information purpose ================
export const getDataExportDate = () => {
  return lastValueFrom(
    localDataTransform<string | undefined>(data => data.find(d => d._id === 'dateVersion')?.dateVersion)
  )
}

