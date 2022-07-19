import { CircularProgress, GridTypeMap, Grid } from '@mui/material';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import React from 'react';

const LoadingBox = ({ sx, ...rest }: DefaultComponentProps<GridTypeMap>) => {
  return (
    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', ...sx }} {...rest}>
      <CircularProgress />
    </Grid>
  );
}

export default LoadingBox;
