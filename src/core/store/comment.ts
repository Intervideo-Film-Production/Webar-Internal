import { getProductComments } from 'src/crud';
import { IComment } from '../declarations/app';
import { StoreStatus } from '../declarations/enum';

export interface ICommentState {
  comments: IComment[] | null;
  commentsStatus: StoreStatus;
  getComments: (lng: string) => void;
  reset: () => void;
}

export const createCommentSlice: (...args: any) => ICommentState = (set) => ({
  comments: null,
  commentsStatus: StoreStatus.empty,
  getComments: async (productId: string) => {
    set({ commentsStatus: StoreStatus.loading });
    const comments = await getProductComments(productId);
    set({ comments, commentsStatus: StoreStatus.loaded });
  },
  reset: () => {
    set({ comments: null, commentsStatus: StoreStatus.empty })
  }
});
