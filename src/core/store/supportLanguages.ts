import { getSupportLanguages } from 'src/crud/crud';
import { ISupportLanguage } from '../declarations/app';
import { StoreStatus } from '../declarations/enum';

export interface ISupportLanguageState {
  languages: ISupportLanguage[] | null;
  languagesStatus: StoreStatus;
  setSupportLanguages: () => void;
}

export const createSupportLanguageSlice: (...args: any) => ISupportLanguageState = (set) => ({
  languages: null,
  languagesStatus: StoreStatus.empty,
  setSupportLanguages: async () => {
    set({ languagesStatus: StoreStatus.loading });
    const languages = await getSupportLanguages();
    set({ languages, languagesStatus: StoreStatus.loaded })
  }
});
