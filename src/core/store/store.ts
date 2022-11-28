import { getStoreData } from 'src/crud/crud';
import { IStore } from '../declarations/app';
import { StoreStatus } from '../declarations/enum';

export interface IStoreState {
  store: IStore | null;
  storeStatus: StoreStatus;
  setStore: (qrValue: string) => void;
  reset: () => void;
}

export const createStoreSlice: (...args: any) => IStoreState = (set) => ({
  store: null,
  storeStatus: StoreStatus.empty,
  setStore: async (qrValue) => {
    set({ storeStatus: StoreStatus.loading });
    const store = await getStoreData(qrValue);
    set({ store, storeStatus: StoreStatus.loaded })
  },
  reset: () => {
    set({
      store: null,
      storeStatus: StoreStatus.empty
    })
  }
});
