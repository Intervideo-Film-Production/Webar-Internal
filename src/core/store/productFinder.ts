import { getSearchCriteria, getSearchCriteriaValues } from 'src/crud';
import { getCategories } from 'src/crud/getCategories';
import { ICategory, ISearchCriteria, ISearchCriteriaValue } from '../declarations/app';
import { StoreStatus } from '../declarations/enum';

export interface IProductFinderState {
  categoriesStatus: StoreStatus;
  categories: ICategory[] | null;
  searchCriteria: ISearchCriteria[] | null;
  searchCriteriaStatus: StoreStatus;
  searchCriteriaValue: ISearchCriteriaValue[] | null;
  searchCriteriaValueStatus: StoreStatus;
  getCategories: (lng: string) => void;
  getSearchCriteria: (lng: string) => void;
  getSearchCriteriaValue: (lng: string) => void;
  reset: () => void;
}

export const createProductFinderSlice: (...args: any) => IProductFinderState = (set) => ({
  categories: null,
  categoriesStatus: StoreStatus.empty,
  searchCriteria: null,
  searchCriteriaValue: null,
  searchCriteriaStatus: StoreStatus.empty,
  searchCriteriaValueStatus: StoreStatus.empty,
  getCategories: async (lng) => {
    set({ categoriesStatus: StoreStatus.loading });
    const categories = await getCategories(lng);
    set({ categories });
    set({ categoriesStatus: StoreStatus.loaded });
  },
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
