import { styled } from '@mui/material/styles';
import { Grid, Link } from '@mui/material';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

declare var Optanon: any;

const CookieConsentInputButton = styled('input')`
  display: block!important; 
  margin-right: auto; 
  font-weight: 700;
  font-size: .5rem;
  border: none;
  background: transparent;
  padding: 0;
`;

const CookieConsent = memo(() => {
  const { t } = useTranslation();

  return (
    <>
      <Grid sx={{
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '20px',
        paddingRight: '20px',
        zIndex: 2000,
        backgroundColor: '#fff',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0

      }}>
        {/* <Typography variant="caption" sx={{ mr: 'auto', fontWeight: 700 }}>{t('CookieConsentText')}</Typography> */}
        <CookieConsentInputButton
        name="btnOneTrust"
        type="button"
        id="btnOneTrust"
        className="btnOneTrust"
        value={t("CookieConsentText")}
        onClick={() => { Optanon.ToggleInfoDisplay() }} />
        <Link href="https://www.pg.com/de_DE/terms_conditions/index.shtml" target="_blank" underline="none" variant="caption" sx={{ mr: '20px', color: '#767676' }}>{t('CookieTermsConditionText')}</Link>
        <Link href="https://www.pg.com/privacy/german/privacy_statement.shtml" target="_blank" underline="none" variant="caption" sx={{ mr: '20px', color: '#767676' }}>{t('CookieProtectionText')}</Link>
        {/* <Link href="https://www.google.com/" target="_blank" underline="none" variant="caption" sx={{ color: '#767676' }}>{t('CookieImprintText')}</Link> */}
      </Grid>
    </>
  )
})

export default CookieConsent;
