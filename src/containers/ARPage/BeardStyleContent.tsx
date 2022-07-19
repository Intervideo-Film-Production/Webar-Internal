import React, { useEffect, useState, useMemo } from 'react';
import { Drawer, Grid, IconButton, Typography, Fade } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useQueryClient } from 'react-query';
import { QueryKeys } from 'src/core/declarations/enum';
import { IBeardStyle } from 'src/core/declarations/app';
import { filter, map, Subject } from 'rxjs';
import { AppButton } from 'src/components';
import CloseIcon from '@mui/icons-material/Close';
import { AppArrowLeftIcon } from 'src/components/icons';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BlockContent, { BlockContentProps } from '@sanity/block-content-to-react';
import { LazyImage } from 'src/components';
import { urlFor } from 'src/crud/api';
import { IButtonContent } from 'src/core/declarations/app';

const projectId: string = process.env.REACT_APP_PROJECT_ID as string;
const dataset: string = process.env.REACT_APP_DATASET as string;

const useStyles = makeStyles(() => ({
  blockContent: {
    display: 'flex',
    '& p': {
      letterSpacing: '-.5px',
      wordSpacing: '-1.5px',
      margin: 0
    }
  }
}));

interface IBeardStylePopupContentProps {
  beardStyleEvent?: Subject<boolean>;
  switchBeardStyleEvent?: Subject<string>;
  beardStyles?: IBeardStyle[];
  headlineHeight?: number;
  onShowButtonContent?: (buttonName: string) => void;
}

const serializers: BlockContentProps['serializers'] = {
  types: {
    image: ({ node: { url } }) => (
      <LazyImage src={url} styles={{
        maxHeight: '200px',
        objectFit: 'contain'
      }} />
    )
  }
}

const BeardStyleContent = ({ beardStyleEvent, switchBeardStyleEvent, beardStyles = [], headlineHeight, onShowButtonContent }: IBeardStylePopupContentProps) => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [displayBeardStyleId, setDisplayBeardStyleId] = useState(beardStyles.length > 0 ? beardStyles[0].id : null);
  const queryClient = useQueryClient();
  const buttonData = queryClient.getQueryData<IButtonContent[]>(QueryKeys.buttonAnimationContent);

  const beardStyleIndex = useMemo(() => {
    if (!displayBeardStyleId || beardStyles.length === 0) return -1;
    const idx = beardStyles.findIndex(bs => bs.id === displayBeardStyleId);
    return idx;
  }, [beardStyles, displayBeardStyleId]);

  const relatedButtonContent = useMemo(() => {
    if (beardStyleIndex > -1) {
      const productButtonName = beardStyles[beardStyleIndex].productButtonName;
      return buttonData?.find(btn => btn.buttonName === productButtonName);
    } else {
      return null;
    }

  }, [buttonData, beardStyleIndex, beardStyles]);

  const handleButtonContentOpen = (buttonName?: string) => {
    if (buttonName) {
      if (beardStyleEvent) beardStyleEvent.next(false);
      if (onShowButtonContent) onShowButtonContent(buttonName);
    }
  }

  const handleDrawerClose = () => {
    if (beardStyleEvent) beardStyleEvent.next(false);
  }

  const handlePrevious = () => {
    const previousBeardIdx = (beardStyleIndex + beardStyles.length - 1) % beardStyles.length;
    if (switchBeardStyleEvent) switchBeardStyleEvent.next(beardStyles[previousBeardIdx].id);
  }

  const handleNext = () => {
    const previousBeardIdx = (beardStyleIndex + beardStyles.length + 1) % beardStyles.length;
    if (switchBeardStyleEvent) switchBeardStyleEvent.next(beardStyles[previousBeardIdx].id);
  }

  useEffect(() => {
    if (beardStyleEvent) {
      const subscription = beardStyleEvent
        .pipe(
          map(showBeardStyles => showBeardStyles && beardStyles.length > 0),
        )
        .subscribe(showBeardStyles => {
          setDrawerOpen(showBeardStyles)
        });

      return () => subscription.unsubscribe();
    }

  }, [beardStyleEvent, beardStyles])

  useEffect(() => {
    if (switchBeardStyleEvent) {
      const subscription = switchBeardStyleEvent
        .pipe(
          filter(() => beardStyles && beardStyles.length > 0),
        )
        .subscribe(beardStyleId => {
          setDisplayBeardStyleId(beardStyleId);
        });

      return () => subscription.unsubscribe();
    }

  }, [switchBeardStyleEvent, beardStyles])

  return (
    <>
      {beardStyles.length > 0 && (
        <Drawer
          anchor="bottom"
          hideBackdrop
          open={drawerOpen}
          onClose={() => handleDrawerClose()}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              backgroundColor: 'transparent',
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateRows: '1fr auto'
            }
          }}
        >

          <Grid
            sx={{
              marginTop: `${(headlineHeight || 0) + 56}px`,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
            <Fade in={drawerOpen}>
              <AppButton
                startIcon={<ArrowBackIosIcon />}
                onClick={() => handleButtonContentOpen(relatedButtonContent?.buttonName)}
                sx={{
                  color: '#fff',
                  height: '39px',
                  borderRadius: '19.5px/50%',
                  backgroundColor: 'rgba(0,0,0,.3)',
                  position: 'absolute',
                  padding: '0px 16px',
                  top: '12px',
                  left: '12px',
                  display: !!relatedButtonContent ? 'inline-flex' : 'none'
                }}
              >{!!relatedButtonContent ? relatedButtonContent.popupTitle : ''}</AppButton>
            </Fade>

            <Fade in={drawerOpen}>
              <IconButton
                onClick={() => handleDrawerClose()}
                sx={{
                  backgroundColor: 'rgba(0,0,0,.3)',
                  width: '39px',
                  height: '39px',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '12px',
                  right: '12px'
                }}>
                <CloseIcon style={{ color: '#fff' }} />
              </IconButton>
            </Fade>

            <Fade in={drawerOpen}>
              <IconButton
                onClick={() => handlePrevious()}
                sx={{
                  position: 'absolute',
                  left: '12px',
                }}>
                <AppArrowLeftIcon sx={{ height: '70px' }} />
              </IconButton>
            </Fade>

            <Fade in={drawerOpen}>
              <IconButton
                onClick={() => handleNext()}
                sx={{
                  position: 'absolute',
                  right: '12px'
                }}>
                <AppArrowLeftIcon sx={{
                  height: '70px',
                  transform: 'rotate(180deg)'
                }} />
              </IconButton>
            </Fade>
          </Grid>

          <Grid
            id="beard-content-drawer"
            sx={theme => ({
              mb: '20px',
              display: 'flex',
              flexDirection: 'column',
              ...theme.arPageStyles?.beardStyles.root
            })}>
            {beardStyleIndex > -1 && (
              <>
                <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                  <Grid sx={{
                    display: 'inline-flex',
                    mr: 1,
                    width: '50px'
                  }}>
                    <img
                      style={{ height: '45px', width: '45px' }}
                      src={
                        process.env.REACT_APP_STATIC_DATA !== 'TRUE'
                          ? urlFor(beardStyles[beardStyleIndex].popupIcon).width(45).height(45).fit('clip').auto('format').url()
                          : beardStyles[beardStyleIndex].popupIcon
                      }
                      alt={beardStyles[beardStyleIndex].popupTitle} />
                  </Grid>
                  <Typography sx={theme => ({ ...theme.arPageStyles?.beardStyles.title })} >{beardStyles[beardStyleIndex].popupTitle}</Typography>
                  <Typography sx={theme => ({
                    marginLeft: "auto",
                    ...theme.arPageStyles?.beardStyles.counter
                  })} >{beardStyleIndex + 1}/{beardStyles.length}</Typography>
                </Grid>
                {
                  (beardStyleIndex > -1 && beardStyles[beardStyleIndex].popupContent)
                  && (<BlockContent
                    className={classes.blockContent}
                    serializers={serializers}
                    blocks={beardStyles[beardStyleIndex].popupContent}
                    imageOptions={{ w: 400, auto: 'format', fit: 'max' }}
                    projectId={projectId}
                    dataset={dataset}
                  />)
                }
              </>
            )}

          </Grid>
        </Drawer>
      )}
    </>
  )
}

export default BeardStyleContent;
