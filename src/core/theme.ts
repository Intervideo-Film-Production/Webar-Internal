import { createTheme, ThemeOptions } from "@mui/material";
import { deepmerge } from '@mui/utils';
import { IFont } from "./declarations/app";

const isMobileOrMac = typeof navigator !== 'undefined' && /iPad|iPhone|iPod|Android|Mac OS/gi.test(navigator.userAgent);

type ICoreTheme = (fontFamily: string) => ThemeOptions;
const coreTheme: ICoreTheme = (fontFamily) => ({
  background: {
    cyan: '#00A0B6',
  },
  palette: {
    text: {
      primary: '#fff',
      secondary: '#000'
    },
  },
  typography: {
    // FIXME all font family should be removed
    h2: {
      fontSize: '3.125rem',
      fontWeight: 'bold',
      fontFamily,
      lineHeight: 1.1,
    },
    h3: {
      fontSize: '1.875rem',
      fontFamily,
    },
    h4: {
      fontFamily,
      fontSize: '1.625rem',
      fontWeight: 500
    },
    h5: {
      fontFamily,
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h6: {
      fontFamily,
      fontSize: '1.25rem',
      fontWeight: 400,
    },
    body1: {
      fontFamily,
      fontSize: '1rem',
    },
    body2: {
      fontFamily,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    caption: {
      fontSize: '.5rem',
      fontFamily,
      lineHeight: 1,
      color: '#767676'
    },
    fontFamily,
    fontSize: 16
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#000'
        },
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#000'
        },
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#000'
        },
        input: {
          color: '#000'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none'
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent'
        }
      }
    },
    MuiRating: {
      styleOverrides: {
        root: {
          fontSize: '24px',
          color: '#ea9d27',
          '& .MuiRating-iconEmpty': {
            color: '#ea9d27',
          }
        },
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&:not(.MuiDialogTitle-root)': {
            ...(isMobileOrMac && (['Helvetica', 'Neue', 'LT', 'Pro'].map(v => v.toLowerCase()).every(v => fontFamily.toLowerCase().includes(v)))
              ? {
                transform: 'translateY(calc(.15em))'
              }
              : {})
          },
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // helvetica neue Pro is not aligned on iOS & Android devices
          // need to translate the text down to make it looks like it is aligned
          '& span.button-text': {
            ...(isMobileOrMac && (['Helvetica', 'Neue', 'LT', 'Pro'].map(v => v.toLowerCase()).every(v => fontFamily.toLowerCase().includes(v)))
              ? {
                transform: 'translateY(calc(.15em))'
              }
              : {})
          }
        }
      }
    }
  }
});

const createAppTheme = (
  fontFamily: string,
  coreThemeVal?: ThemeOptions,
  fontSetting?: IFont[],
  headerStyles?: ThemeOptions['headerStyles'],
  loadingBoxStyles?: ThemeOptions['loadingBoxStyles'],
  arPageStyles?: ThemeOptions['arPageStyles'],
  homePageStyles?: ThemeOptions['homePageStyles'],
  scanPageStyles?: ThemeOptions['scanPageStyles'],
  productFinderStyles?: ThemeOptions['productFinderStyles'],
) => {
  return createTheme(deepmerge(
    // set core settings
    coreTheme(fontFamily),
    // set brand settings
    {
      ...coreThemeVal,
      fontSetting,
      headerStyles,
      loadingBoxStyles,
      arPageStyles,
      homePageStyles,
      scanPageStyles,
      productFinderStyles
    } as ThemeOptions
  ))
}

export default createAppTheme;
