import { Box, IconButton, Toolbar, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppGrid } from 'src/components';
import { useBoundStore } from 'src/core/store';
import CategoryItem from './CategoryItem';
import NavigationButtons from './NavigationButtons';

const CategorySelection: React.FC = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const {
    categories,
    getCategories
  } = useBoundStore(state => ({
    getCategories: state.getCategories,
    categories: state.categories
  }));

  useEffect(() => {
    if (!!i18n.language)
      getCategories(i18n.language);
  }, [getCategories, i18n.language])

  return (
    <AppGrid sx={{
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: 'radial-gradient(#e5e5e5 71%, #d9d9d9 100%)'
    }}>
      <Toolbar />

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: '24px',
        paddingTop: '30px'
      }}>
        <Typography
          variant="h4"
          color="primary"
          sx={{
            fontWeight: 700,
            whiteSpace: 'nowrap',
            marginBottom: '1rem'
          }}>{t("ChooseCategoryText")}</Typography>
      </Box>

      {/* Category Selection */}
      <Box sx={{
        px: '24px'
      }}>
        {categories?.map((category, idx) =>
        (<CategoryItem
          key={`key-${idx}`}
          onClick={() => { navigate(`/product-finder?cat=${category.id}`) }}
          image={category.image}
          title={category.name} />
        ))}
      </Box>

      <NavigationButtons />
    </AppGrid>
  )
}

export default CategorySelection;
