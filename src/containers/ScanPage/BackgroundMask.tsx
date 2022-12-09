import { Grid } from '@mui/material';
import React, { memo } from 'react';

const BackgroundMask = memo(() => <Grid
    sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        background: "rgba(0,0,0,.3)",
        maskImage: `url("imgs/rect.svg")`,
        maskRepeat: "no-repeat",
        maskPosition: "center top",
        maskSize: "1000px 1000px",
        zIndex: 3,
    }}
/>)

export default BackgroundMask;
