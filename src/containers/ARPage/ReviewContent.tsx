import { Toolbar, Dialog, Box, IconButton, Rating, Typography, Divider, DialogTitle, DialogContent } from '@mui/material';
import React, { memo } from 'react';
// import ProductHeadline from './ProductHeadline';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from 'react-query';
import { QueryKeys } from 'src/core/declarations/enum';
import { LoadingBox } from 'src/components';
import { getProductComments } from 'src/crud/crud';
import { useTranslation } from 'react-i18next';

interface IReviewContent {
  productId: string;
  open: boolean;
  onReviewToggle?: Function;
}

const ReviewContent = memo(({ productId, open, onReviewToggle }: IReviewContent) => {
  const { t } = useTranslation();
  const { isLoading, data } = useQuery(QueryKeys.productComments, () => getProductComments(productId))

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
          isLoading
            ? (<LoadingBox sx={{ height: '100%' }} />)
            : (<Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant='h6' sx={theme => ({ ...theme.arPageStyles?.reviewContent.title })}>{t('ArPageReviewContentTitle')}</Typography>

              {(data && data.length > 0)
                ? data?.map((comment, i) =>
                (<Box key={`comment-rating-${i}`}>
                  <Rating sx={{ mb: 2 }} value={comment.stars} readOnly />
                  <Typography variant="body2" sx={theme => ({ ...theme.arPageStyles?.reviewContent.reviewHeadline })}>{comment.headline}</Typography>
                  <Typography variant="body2" sx={theme => ({ ...theme.arPageStyles?.reviewContent.reviewText })}>{comment.comment}</Typography>
                  {i < (data?.length - 1) && (<Divider sx={theme => ({ marginTop: 2, marginBottom: 2, ...theme.arPageStyles.reviewContent.divider })} />)}
                </Box>))
                : (<Typography variant="body2">{t('ARPageReviewNoContent')}</Typography>)}
            </Box>)
        }
      </DialogContent>
    </Dialog>
  );
})

export default ReviewContent;
