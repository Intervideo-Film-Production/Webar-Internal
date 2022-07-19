import React, { memo } from 'react';
import { SwipeableDrawer, Theme, Toolbar, IconButton, Typography, List, ListItemButton, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { QueryKeys } from 'src/core/declarations/enum';
import { IProduct, IQRCodeData } from 'src/core/declarations/app';
import { getCompareProducts } from 'src/crud/crud';
import { LoadingBox, CompareProductContent } from 'src/components';
import { useAppContext } from 'src/core/store';
import { sortFunction } from 'src/core/helpers';

interface ICompareDrawerProps {
  drawerOpen: boolean;
  onDrawerToggle?: Function;
  onCompareDetails?: (compareProductId: string) => void;
}

const ThemedSwipeableDrawer = styled(SwipeableDrawer)(({ theme }: { theme: Theme }) => ({
  '& .MuiPaper-root': {
    width: '212px',
    overflow: 'hidden',
    paddingBottom: '20px',
    ...theme.arPageStyles?.compareDrawer.root
  }
}))

const CompareDrawer = memo(({ drawerOpen, onDrawerToggle, onCompareDetails }: ICompareDrawerProps) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const { productClaimToggleEvent } = useAppContext();
  const qrCodeData = queryClient.getQueryData<IQRCodeData>(QueryKeys.qrCode);
  const product = queryClient.getQueryData(QueryKeys.product) as IProduct;
  const { id, name, categoryId } = product;

  const handleCompareProduct = (compareProductId: string) => {
    if (onCompareDetails) onCompareDetails(compareProductId);
  }

  const { isLoading, data } = useQuery(
    QueryKeys.compareProducts,
    () => getCompareProducts(id, qrCodeData?.id as string, categoryId, i18n.language),
    {
      enabled: drawerOpen
    });

  const handleDrawerToggle = (shouldDrawerOpen: boolean) => {
    if (onDrawerToggle) onDrawerToggle(shouldDrawerOpen);
    if (productClaimToggleEvent) productClaimToggleEvent.next(!shouldDrawerOpen);
  }

  return (
    <ThemedSwipeableDrawer
      variant="persistent"
      anchor="right"
      open={drawerOpen}
      onClose={() => handleDrawerToggle(false)}
      onOpen={() => handleDrawerToggle(true)}
    >
      <Toolbar />
      <Grid
        sx={theme => ({
          px: 2,
          zIndex: 1,
          ...theme.arPageStyles?.compareDrawer.titleBox.root
        })}
      >
        <IconButton sx={theme => ({ ...theme.arPageStyles.compareDrawer.titleBox.closeButton })} onClick={() => handleDrawerToggle(false)}>
          <KeyboardArrowRightIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={theme => ({ ...theme.arPageStyles.compareDrawer.titleBox.title })}
        >{t('ArPageCompareTitle', { productName: name })}</Typography>

      </Grid>

      {isLoading
        ? (<LoadingBox />)
        : (<List sx={{
          overflow: 'auto',
          pt: 0,
          px: 2
        }}>
          {data && data.sort(sortFunction).map((p) => (<ListItemButton key={`compare-item-${p.id}`}
            sx={{
              width: '180px',
              height: '180px',
              position: 'relative',
              p: 0,
              mb: 1
            }}
            onClick={() => handleCompareProduct(p.id)}
          >
            <CompareProductContent product={p} />
          </ListItemButton >))}
        </List>)
      }

    </ThemedSwipeableDrawer >
  )
});

export default CompareDrawer;
