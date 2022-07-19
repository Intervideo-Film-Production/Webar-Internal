import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const AppHelmet = memo(() => {
  const { i18n } = useTranslation();

  return (
    <Helmet>
      <html lang={i18n.language} />
    </Helmet>
  )
})

export default AppHelmet;
