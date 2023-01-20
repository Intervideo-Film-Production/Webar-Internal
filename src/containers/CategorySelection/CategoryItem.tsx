import { Box, BoxProps, Typography } from '@mui/material';
import React from 'react';
import { LazyImage } from 'src/components';

interface ICategoryItemProps {
  image: string;
  title: string;
}

const CategoryItem: React.FC<ICategoryItemProps & BoxProps> = ({ image, title, ...props }) => {
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        boxShadow: '',
        width: 'calc(100vw - 56px)',
        backgroundColor: '#fff',
        marginBottom: '25px'
      }}>
      <LazyImage
        src={image}
        styles={{
          width: '143px',
          height: '143px'
        }} />
      <div style={{
        flexGrow: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <Typography variant="h5" sx={{ color: '#152436' }}>{title}</Typography>
      </div>
    </Box>
  )
}

export default CategoryItem;
