import React from 'react';
import { Box } from '@mui/material';
import { AppButton } from 'src/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NavigationButtons = ({ isProductFinderPage }: { isProductFinderPage?: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '24px 16px 16px',
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <AppButton sx={{
        whiteSpace: "pre-wrap",
        borderRadius: '10px',
        padding: "20px",
        lineHeight: 1,
        backgroundColor: "#f93a6b",
        color: "#fff",
        fontSize: '1.25rem'
      }}
        onClick={() => { navigate("/") }}>{t("CategoryBackButtonText")}</AppButton>

      {isProductFinderPage && (
        <AppButton sx={{
          whiteSpace: "pre-wrap",
          borderRadius: '10px',
          padding: "20px",
          lineHeight: 1,
          backgroundColor: "#f93a6b",
          color: "#fff",
          fontSize: '1.25rem'
        }} onClick={() => { navigate("/categories") }}>{t("CategoryBackToCategoryButtonText")}</AppButton>
      )}

      <AppButton sx={{
        whiteSpace: "pre-wrap",
        borderRadius: '10px',
        padding: "20px",
        lineHeight: 1,
        backgroundColor: "#f93a6b",
        color: "#fff",
        fontSize: '1.25rem'
      }} onClick={() => { navigate("/scan-page") }}>{t("CategoryScanButtonText")}</AppButton>
    </Box>
  )
}

export default NavigationButtons;
