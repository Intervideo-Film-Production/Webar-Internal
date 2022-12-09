import { Toolbar, Dialog, Box, IconButton, Rating, Typography, Divider, DialogTitle, DialogContent } from '@mui/material';
import React, { memo, useEffect } from 'react';
// import ProductHeadline from './ProductHeadline';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingBox } from 'src/components';
import { useTranslation } from 'react-i18next';
import { useBoundStore } from 'src/core/store';
import { StoreStatus } from 'src/core/declarations/enum';
import { getProductComments } from 'src/crud';
interface IReviewContent {
  productId: string;
  open: boolean;
  onReviewToggle?: Function;
}

const ReviewContent = memo(({ productId, open, onReviewToggle }: IReviewContent) => {
  const { t } = useTranslation();
  const { comments, commentStatus, getComments } = useBoundStore(state => ({
    comments: state.comments,
    commentStatus: state.commentsStatus,
    getComments: state.getComments
  }))

  useEffect(() => {
    getComments(productId);
  }, [productId, getComments])

  const handleReviewToggle = (shouldOpen: boolean) => {
    if (onReviewToggle) {
      onReviewToggle(shouldOpen);
    }
  }

  return (
    <Dialog
      fullScreen
      open={open}
      scroll="paper"
      onClose={() => handleReviewToggle(false)}
      keepMounted={true}
    >
      <DialogTitle sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 0,
        fontWeight: theme => theme.typography.body1.fontWeight,
        fontSize: theme => theme.typography.body1.fontSize
      }}>
        <Toolbar />
        <IconButton
          sx={{ marginLeft: 'auto' }}
          onClick={() => handleReviewToggle(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 2, mb: '20px', color: theme => theme.palette.text.secondary }} >
        {
          commentStatus === StoreStatus.loading
            ? (<LoadingBox sx={{ height: '100%' }} />)
            : (<Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant='h6' sx={theme => ({ ...theme.arPageStyles?.reviewContent.title })}>{t('ArPageReviewContentTitle')}</Typography>

              {(comments && comments.length > 0)
                ? comments?.map((comment, i) =>
                (<Box key={`comment-rating-${i}`}>
                  <Rating sx={{ mb: 2 }} value={comment.stars} readOnly />
                  <Typography variant="body2" sx={theme => ({ ...theme.arPageStyles?.reviewContent.reviewHeadline })}>{comment.headline}</Typography>
                  <Typography variant="body2" sx={theme => ({ ...theme.arPageStyles?.reviewContent.reviewText })}>{comment.comment}</Typography>
                  {i < (comments?.length - 1) && (<Divider sx={theme => ({ marginTop: 2, marginBottom: 2, ...theme.arPageStyles.reviewContent.divider })} />)}
                </Box>))
                : (<Typography variant="body2">{t('ARPageReviewNoContent')}</Typography>)}
            </Box>)
        }
      </DialogContent>
    </Dialog>
  );
})

export default ReviewContent;
