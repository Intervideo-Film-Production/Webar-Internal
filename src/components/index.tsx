import { Grid } from "@mui/material";
import { styled } from "@mui/system";

// override MuiComponents
export const AppGrid = styled(Grid)(() => ({
  display: 'grid',
  flexGrow: 1,
}))

// export app components
export { default as LoadingBox } from './LoadingBox';
export { default as VideoJS } from './Videojs';
export { default as LazyImage } from './LazyImage';
export { default as AppButton } from './AppButton';
export { default as TabPanel } from './TabPanel';
export { default as CompareProductContent } from './CompareProductContent';
