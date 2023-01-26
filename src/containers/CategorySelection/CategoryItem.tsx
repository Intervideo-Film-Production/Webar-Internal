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
        width: 'calc(100vw - 48px)',
        backgroundColor: '#fff',
        marginBottom: '22px'
      }}>
      <LazyImage
        src={image}
        styles={{
          width: '125px',
          height: '125px'
        }} />
      <div style={{
        flexGrow: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <Typography variant="body1" sx={{ color: '#152436', fontWeight: 400, fontSize: '18px' }}>{title}</Typography>
      </div>
    </Box>
  )
}

export default CategoryItem;
