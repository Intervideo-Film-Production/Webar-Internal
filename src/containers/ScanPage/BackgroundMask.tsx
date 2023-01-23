import { Grid } from '@mui/material';
import React, { memo } from 'react';

interface IBackgroundMaskProps {
    maskImage: string;
    backgroundColor?: string;
}

const BackgroundMask = memo<IBackgroundMaskProps>(({ maskImage, backgroundColor = "rgba(0,0,0,.4)" }) => <Grid
    sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        background: backgroundColor,
        // background: "rgba(0,0,0,.4)",
        maskImage: `url("${maskImage}")`,
        // maskImage: `url("imgs/rect.svg")`,
        maskRepeat: "no-repeat",
        maskPosition: "center top",
        maskSize: "1000px 1000px",
        zIndex: 3,
    }}
/>)

export default BackgroundMask;
