import React, { memo, useCallback, useMemo, useState } from 'react';
import { SwipeableDrawer, Grid, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQueryClient } from 'react-query';
import { makeStyles } from '@mui/styles';
import BlockContent, { BlockContentProps } from '@sanity/block-content-to-react';
import { QueryKeys } from 'src/core/declarations/enum';
import { IButtonContent, IProduct } from 'src/core/declarations/app';
import { LazyImage, VideoJS } from 'src/components';
import { urlFor } from 'src/crud/api';
import { useTranslation } from 'react-i18next';
import { isIOS } from 'src/core/helpers';
import { styled } from "@mui/material/styles";

const iOS = isIOS();

const projectId: string = process.env.REACT_APP_PROJECT_ID as string;
const dataset: string = process.env.REACT_APP_DATASET as string;

interface IButtonPopupContentProps {
  buttonName: string;
  onToggle?: (buttonName: string) => any;
  // onShowBeardStyle?: (beardStyle: string) => void;
}

const useStyles = makeStyles(() => ({
  blockContent: {
    display: 'flex',
    '& p': {
      letterSpacing: '-.5px',
      wordSpacing: '-1.5px',
      margin: 0
    }
  },
  blockContentVideoMaxSize: {
    display: 'block'
  }
}));

const ThemedBlockContent = styled(Grid)(({ theme }) => ({
  ...theme.arPageStyles?.buttonPopupContent.content
}));

const getButtonContent = (buttonName: string, buttonContentList: IButtonContent[] | null | undefined): IButtonContent | null | undefined => {
  const buttonContent = !buttonContentList ? null : buttonContentList.find(bc => bc.buttonName === buttonName);
  if (!!buttonContent &&
    (!buttonContent.popupContent || !buttonContent.popupTitle || !buttonContent.icon)) {
    console.warn('Input mistake, Popup must include content, title, and icon.');
  }
  return buttonContent;
}

const ButtonPopupContent = memo(({ buttonName, onToggle,
  // FIXME need this?
  // onShowBeardStyle
}: IButtonPopupContentProps) => {
  const classes = useStyles();
  const [isVideoMaxSize, setVideoMaxSize] = useState(false);
  const queryClient = useQueryClient();
  const buttonData = queryClient.getQueryData<IButtonContent[]>(QueryKeys.buttonAnimationContent);
  const beardStyles = queryClient.getQueryData<IProduct>([QueryKeys.product])?.beardStyles;
  const { t } = useTranslation();

  const toggleHandle = useCallback((buttonName: string) => {
    if (onToggle) onToggle(buttonName);
    if (buttonName === '') setVideoMaxSize(false);
  }, [onToggle])

  const buttonContent = useMemo(() => getButtonContent(buttonName, buttonData), [buttonName, buttonData])
  const relatedBeardStyle = useMemo(() => {
    if (!buttonContent || !beardStyles || beardStyles.length === 0) return null;

    return beardStyles.find(bs => bs.productButtonName === buttonContent.buttonName)?.id;

  }, [buttonContent, beardStyles])

  const onVideoMaxSizeHandle = useCallback(() => {
    setVideoMaxSize(true);
  }, [])

  const serializers = useMemo<BlockContentProps['serializers']>(() => ({
    types: {
      image: ({ node: { url } }) => (
        <LazyImage src={url} styles={{
          maxHeight: '200px',
          objectFit: 'contain'
        }} />
      ),
      file: ({ node: { url, previewImage } }) => {
        return (<VideoJS
          sources={[url]}
          poster={previewImage &&
            (process.env.REACT_APP_STATIC_DATA !== 'TRUE'
              ? urlFor(previewImage.asset).width(100).height(100).auto('format').fit('max').url()
              : previewImage.url)}
          onMaxSize={onVideoMaxSizeHandle}
        />)
      }
    },
  }), [onVideoMaxSizeHandle]);

  // const handleOpenBeardStyle = useCallback((beardStyleId: string) => {
  //   toggleHandle('');
  //   if (onShowBeardStyle) onShowBeardStyle(beardStyleId);
  // }, [onShowBeardStyle, toggleHandle]);

  const contentAndSerializers = useMemo(() => {
    if (relatedBeardStyle) {

      // FIXME check if needed
      // const beardFeatureButtonRender = (props: any) => {
      //   return (<span
      //     style={{ textDecoration: 'underline' }}
      //     onClick={() => handleOpenBeardStyle(relatedBeardStyle)}
      //   >{props.children}</span>)
      // }
      // if (!!serializers) {
      //   serializers.marks = { beardFeatureButton: beardFeatureButtonRender }
      // }

      const blockChild = buttonContent?.popupContent?.find(pc => pc['_type'] === 'block');
      if (blockChild && blockChild.children.length > 0) {
        const alreadyExisted = blockChild.children?.find((c: any) => c._key === '88888888888888888888');
        if (!alreadyExisted) {
          blockChild.children.push({
            _key: '88888888888888888888',
            _type: 'span',
            marks: ['99999999999999999999'],
            text: t('PopupContentTryBeardText')
          });

          blockChild.markDefs.push({
            _key: '99999999999999999999',
            _type: 'beardFeatureButton'
          });
        }

      } else {
        if (!!buttonContent?.popupContent) {

          buttonContent.popupContent.push({
            children: [
              {
                _key: '88888888888888888888',
                _type: 'span',
                marks: ['99999999999999999999'],
                text: t('PopupContentTryBeardText')
              }
            ],
            markDefs: [{
              _key: '99999999999999999999',
              _type: 'beardFeatureButton'
            }],
            style: "normal",
            _key: "77777777777777777777",
            _type: "block"
          });
        }
      };
    }

    return {
      content: buttonContent?.popupContent,
      serializers
    };

  }, [buttonContent, relatedBeardStyle, serializers, t])

  return (
    <SwipeableDrawer
      anchor="bottom"
      hideBackdrop
      open={!!buttonContent && buttonContent.popupContent !== null}
      onClose={() => toggleHandle('')}
      onOpen={() => { }}
      ModalProps={{
        keepMounted: true,
        sx: {
          top: 'auto'
        }
      }}
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
        }
      }}
      swipeAreaWidth={0}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
    >
      <Grid sx={theme => ({
        display: 'flex',
        flexDirection: 'column',
        ...theme.arPageStyles?.buttonPopupContent.root
      })}>
        {!!buttonContent && buttonContent.popupContent !== null && (
          <>
            <Grid sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid sx={{
                display: 'inline-flex',
                mr: 1,
                width: '50px'
              }}>
                {!!buttonContent?.icon && (
                  <img style={{ height: '45px', width: '45px', objectFit: 'cover' }} src={
                    process.env.REACT_APP_STATIC_DATA !== 'TRUE'
                      ? urlFor(buttonContent?.icon).width(45).height(45).fit('clip').auto('format').url()
                      : buttonContent?.icon
                  } alt={buttonContent?.icon} />
                )}
              </Grid>
              <Typography sx={theme => ({
                ...theme.arPageStyles?.buttonPopupContent.title
              })} >{buttonContent?.popupTitle}</Typography>
              <IconButton sx={theme => ({
                marginLeft: 'auto',
                ...theme.arPageStyles?.buttonPopupContent.closeButton
              })} onClick={() => toggleHandle('')}>
                <CloseIcon />
              </IconButton>
            </Grid>

            {
              !!contentAndSerializers.content && (<ThemedBlockContent>
                <BlockContent
                  className={`${classes.blockContent} ${isVideoMaxSize ? classes.blockContentVideoMaxSize : ''}`}
                  serializers={contentAndSerializers.serializers}
                  blocks={contentAndSerializers.content}
                  imageOptions={{ w: 400, auto: 'format', fit: 'max' }}
                  projectId={projectId}
                  dataset={dataset}
                />
              </ThemedBlockContent>)
            }
          </>
        )}

      </Grid>
    </SwipeableDrawer>
  )
})

export default ButtonPopupContent;
