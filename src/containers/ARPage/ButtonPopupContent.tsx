import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Rating, Toolbar, Typography } from '@mui/material';
import { t } from 'i18next';
import React, { useMemo, useRef, useState } from 'react';
import { LoadingBox, VideoJS } from 'src/components';
import CloseIcon from '@mui/icons-material/Close';
import BlockContent from '@sanity/block-content-to-react';
import PopupVideoContent from './PopupVideoContent';
import { Subject } from 'rxjs';

const projectId: string = process.env.REACT_APP_PROJECT_ID as string;
const dataset: string = process.env.REACT_APP_DATASET as string;

interface IButtonPopupContentProps {
  content?: { [key: string]: any }[];
  video?: string;
  open: boolean;
  onToggle?: Function;
}

const ButtonPopupContent: React.FC<IButtonPopupContentProps> = ({ open, onToggle, content, video }) => {
  const videoCloseEvent = useMemo(() => new Subject<void>(), []);

  const handleClosed = () => {
    if (!!video) videoCloseEvent.next();
    if (!!onToggle) onToggle("")
  }



  return (
    <Dialog
      fullScreen
      open={open}
      scroll="paper"
      // FIXME
      onClose={() => { handleClosed(); }}
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
          onClick={() => { handleClosed(); }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 2, mb: '20px' }} >
        {!!video && (
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <PopupVideoContent stopVideoEvent={videoCloseEvent} source={video} />
          </div>
        )}
        {!!content && (<BlockContent
          blocks={content}

          // className={classes.blockContent}
          // serializers={serializers}
          // blocks={beardStyles[beardStyleIndex].popupContent}
          // imageOptions={{ w: 400, auto: 'format', fit: 'max' }}
          projectId={projectId}
          dataset={dataset}
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
