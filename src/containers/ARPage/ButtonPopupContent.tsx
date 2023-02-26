import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Toolbar } from '@mui/material';
import React, { useMemo } from 'react';
import { LazyImage, VideoJS } from 'src/components';
import CloseIcon from '@mui/icons-material/Close';
import BlockContent, { BlockContentProps } from '@sanity/block-content-to-react';
import PopupVideoContent from './PopupVideoContent';
import { Subject } from 'rxjs';
import { urlFor } from 'src/crud/api';
import InlineImage from 'src/InlineImage';
import { makeStyles } from '@mui/styles';

const projectId: string = process.env.REACT_APP_PROJECT_ID as string;
const dataset: string = process.env.REACT_APP_DATASET as string;

interface IButtonPopupContentProps {
  content?: { [key: string]: any }[];
  video?: string;
  open: boolean;
  onToggle?: Function;
}

const useStyles = makeStyles(() => ({
  blockContent: {
    height: '100%',
    display: 'flex',
    '& p': {
      letterSpacing: '-.5px',
      wordSpacing: '-1.5px',
      margin: 0
    },
    alignItems: 'baseline'
  }
}));

const ButtonPopupContent: React.FC<IButtonPopupContentProps> = ({ open, onToggle, content, video }) => {
  const videoCloseEvent = useMemo(() => new Subject<void>(), []);
  const classes = useStyles();

  const serializers = useMemo<BlockContentProps['serializers']>(() => ({
    types: {
      inlineImage: ({ node: { imageArray } }) => {
        return (
          <Grid sx={{
            margin: 'auto',
            display: 'grid',
            flexWrap: 'wrap',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: `repeat(${Math.ceil(imageArray.length / 3)}, 1fr)`
          }}>
            {imageArray.map((imgObj: any, idx: number) => (
              <InlineImage
                key={`product-feature-image-${idx}`}
                imgObj={imgObj}
                isFirst={idx === 0}
              />
            ))}
          </Grid>
        );
      },
      image: ({ node: { metadata, url, ...rest } }) => {
        console.log("dadsdsa", rest);
        return (
          <LazyImage src={url} styles={{
            maxHeight: '200px',
            objectFit: 'contain'
          }} />
        )
      },
      file: ({ node: { url, previewImage } }) => {
        return (<VideoJS
          sources={[url]}
          poster={previewImage &&
            (process.env.REACT_APP_STATIC_DATA !== 'TRUE'
              ? urlFor(previewImage.asset).width(100).auto('format').fit('max').url()
              : previewImage.url)}
        />)
      }
    },
  }), []);

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
          className={classes.blockContent}
          serializers={serializers}
          // blocks={beardStyles[beardStyleIndex].popupContent}
          imageOptions={{ w: 400, auto: 'format', fit: 'max' }}
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
