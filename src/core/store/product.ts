import { getProductById, getProduct, getFirstProductQRCodes, findMatchingProducts, getAllProductsByQRCode } from 'src/crud';
import { IProduct } from '../declarations/app';
import { StoreStatus } from '../declarations/enum';

export interface IProductState {
  product: IProduct | null;
  productStatus: StoreStatus;
  getById: (productId: string, lng: string, qrCodeId: string) => void;
  getByQR: (qrValue: string, lng: string, qrCodeId: string) => void;
  setProduct: (product: IProduct) => void;
  resetProduct: () => void;
  imageTargetCodes: string[] | null;
  imageTargetCodesStatus: StoreStatus;
  setImageTargetCodes: (storeId: string) => void;

  productsByQrCode: IProduct[] | null;
  productsByQrCodeStatus: StoreStatus;
  getAllProductsByQRCode: (storeId: string, lng: string) => void;

  searchProducts: IProduct[] | null;
  searchProductsStatus: StoreStatus;
  findMatchingProducts: (selectedAnswers: Array<{ questionId: string, answerId: string | string[] }>, lng: string, storeId: string, category: string) => void;
}

export const createProductSlice: (...args: any) => IProductState = (set) => ({
  product: null,
  productStatus: StoreStatus.empty,
  getById: async (productId, lng, qrCodeId) => {
    set({ productStatus: StoreStatus.loading });
    const product = await getProductById(productId, lng, qrCodeId);
    set({ product, productStatus: StoreStatus.loaded });
  },
  getByQR: async (qrValue, lng, qrCodeId) => {
    set({ productStatus: StoreStatus.loading });
    const product = await getProduct(qrValue, lng, qrCodeId);
    set({ product, productStatus: StoreStatus.loaded });
  },
  setProduct: (product: IProduct) => {
    set({ product })
  },
  resetProduct: () => {
    set({
      product: null,
      status: StoreStatus.empty
    })
  },

  imageTargetCodes: null,
  imageTargetCodesStatus: StoreStatus.empty,
  setImageTargetCodes: async (storeId) => {
    set({ imageTargetCodesStatus: StoreStatus.loading });
    const imageTargetCodes = await getFirstProductQRCodes(storeId);
    set({ imageTargetCodes: imageTargetCodes.slice(0, 5), imageTargetCodesStatus: StoreStatus.loaded });
  },

  searchProducts: null,
  searchProductsStatus: StoreStatus.empty,
  findMatchingProducts: async (selectedAnswers, lng, storeId, category) => {
    set({ searchProductsStatus: StoreStatus.loading });
    const searchProducts = await findMatchingProducts(selectedAnswers, lng, storeId, category);
    set({ searchProducts, searchProductsStatus: StoreStatus.loaded });
  },

  productsByQrCode: null,
  productsByQrCodeStatus: StoreStatus.empty,
  getAllProductsByQRCode: async (storeId: string, lng: string) => {
    set({ productsByQrCodeStatus: StoreStatus.loading });
    const productsByQrCode = await getAllProductsByQRCode(storeId, lng);
    set({ productsByQrCode, productsByQrCodeStatus: StoreStatus.loading });
  }
});
