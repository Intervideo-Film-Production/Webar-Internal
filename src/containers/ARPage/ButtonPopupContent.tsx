import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Rating, Toolbar, Typography } from '@mui/material';
import { t } from 'i18next';
import React, { useState } from 'react';
import { LoadingBox, VideoJS } from 'src/components';
import CloseIcon from '@mui/icons-material/Close';
import BlockContent from '@sanity/block-content-to-react';

interface IButtonPopupContentProps {
  content?: { [key: string]: any }[];
  video?: string;
  open: boolean;
  onToggle?: Function;
}

const ButtonPopupContent: React.FC<IButtonPopupContentProps> = ({ open, onToggle, content, video }) => {
  return (
    <Dialog
      fullScreen
      open={open}
      scroll="paper"
      // FIXME
      onClose={() => { if (!!onToggle) onToggle("") }}
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
          onClick={() => { if (!!onToggle) onToggle("") }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 2, mb: '20px' }} >
        {!!video && (<VideoJS
          sources={[video]}
          onReady={v => v.play()}
        />)}
        {!!content && (<BlockContent
          blocks={content}
        />)}
        {/* {
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
      } */}
      </DialogContent>
    </Dialog>
  )
}

export default ButtonPopupContent;
