
import create from 'zustand';
import { IButtonContentState, createButtonContentSlice } from './buttonContent';
import { ICommentState, createCommentSlice } from './comment';
import { IProductState, createProductSlice } from './product';
import { IProductFinderState, createProductFinderSlice } from './productFinder';
import { IStoreState, createStoreSlice } from './store';
import { ISupportLanguageState, createSupportLanguageSlice } from './supportLanguages';

interface IAggregationStateAction {
  resetData: (resetStore?: boolean) => void;
}

type IBoundStore = IProductState
  & IStoreState
  & ISupportLanguageState
  & IProductFinderState
  & IButtonContentState
  & ICommentState
  & IAggregationStateAction;

const createAggregationSlice: (...args: any) => IAggregationStateAction = (set) => ({
  resetData: () => {
    // reset product data
    createProductSlice(set).resetProduct();

    // reset comment data
    createCommentSlice(set).reset();

    // reset button data
    createButtonContentSlice(set).reset();

    // reset product finder data
    createProductFinderSlice(set).reset();
  }
})

// FIXME check where the below are and should be removed?
// queryClient.removeQueries(QueryKeys.compareProduct, { exact: true });
// queryClient.removeQueries(QueryKeys.imageTargetsCodes, { exact: true });

const useBoundStore = create<IBoundStore>((...a) => ({
  ...createProductSlice(...a),
  ...createStoreSlice(...a),
  ...createSupportLanguageSlice(...a),
  ...createProductFinderSlice(...a),
  ...createButtonContentSlice(...a),
  ...createCommentSlice(...a),
  ...createAggregationSlice(...a),
}));

export { useBoundStore };
