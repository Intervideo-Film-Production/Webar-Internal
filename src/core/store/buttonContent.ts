import { getButtonAnimationContent } from 'src/crud/crud';
import { IButtonContent } from '../declarations/app';
import { StoreStatus } from '../declarations/enum';

export interface IButtonContentState {
  buttons: IButtonContent[] | null;
  buttonsStatus: StoreStatus;
  getButtonContents: (productId: string, lng: string) => void;
  reset: () => void;
}

// FIXME ...args
export const createButtonContentSlice: (...args: any) => IButtonContentState = (set) => ({
  buttons: null,
  buttonsStatus: StoreStatus.empty,
  getButtonContents: async (productId, lng) => {
    set({ buttonsStatus: StoreStatus.loading });
    const buttons = await getButtonAnimationContent(productId, lng);
    set({ buttons, buttonsStatus: StoreStatus.loaded });
  },
  reset: () => {
    set({
      buttons: null,
      buttonsStatus: StoreStatus.empty
    })
  }
});
