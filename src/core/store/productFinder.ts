import { getSearchCriteria, getSearchCriteriaValues } from 'src/crud/crud';
import { ISearchCriteria, ISearchCriteriaValue } from '../declarations/app';
import { StoreStatus } from '../declarations/enum';

export interface IProductFinderState {
  searchCriteria: ISearchCriteria[] | null;
  searchCriteriaStatus: StoreStatus;
  searchCriteriaValue: ISearchCriteriaValue[] | null;
  searchCriteriaValueStatus: StoreStatus;
  getSearchCriteria: (lng: string) => void;
  getSearchCriteriaValue: (lng: string) => void;
  reset: () => void;
}

export const createProductFinderSlice: (...args: any) => IProductFinderState = (set) => ({
  searchCriteria: null,
  searchCriteriaValue: null,
  searchCriteriaStatus: StoreStatus.empty,
  searchCriteriaValueStatus: StoreStatus.empty,
  getSearchCriteria: async (lng) => {
    set({ searchCriteriaStatus: StoreStatus.loading });
    const searchCriteria = await getSearchCriteria(lng);
    set({ searchCriteria, searchCriteriaStatus: StoreStatus.loaded });
  },
  getSearchCriteriaValue: async (lng) => {
    set({ searchCriteriaValueStatus: StoreStatus.loading });
    const searchCriteriaValue = await getSearchCriteriaValues(lng);
    set({ searchCriteriaValue, searchCriteriaValueStatus: StoreStatus.loaded });
  },
  reset: () => {
    set({
      searchCriteria: null,
      searchCriteriaStatus: StoreStatus.empty,
      searchCriteriaValue: null,
      searchCriteriaValueStatus: StoreStatus.empty,
    })
  }
});
