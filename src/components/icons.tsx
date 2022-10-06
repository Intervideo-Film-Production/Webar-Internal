import React from 'react';
import { SvgIcon, SvgIconTypeMap } from "@mui/material";
import { DefaultComponentProps } from '@mui/material/OverridableComponent';

export const ProductInfoIcon = (props: DefaultComponentProps<SvgIconTypeMap>) => {
  return (
    <SvgIcon {...props} viewBox='0 0  42 42'>
      <svg id="info_help" data-name="info/help" xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
        <circle id="Ellipse_7" data-name="Ellipse 7" cx="21" cy="21" r="21" opacity="0.3" />
        <text id="i" transform="translate(21 29)" fill="#fff" fontSize="24" fontFamily="Arial-BoldMT, Arial" fontWeight="700"><tspan x="-3.334" y="0">i</tspan></text>
      </svg>

    </SvgIcon>
  )
}

export const InfoIcon = (props: DefaultComponentProps<SvgIconTypeMap>) => {
  return (
    <SvgIcon {...props} viewBox='0 0 8 27'>
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="27" viewBox="0 0 8 27">
        <g id="info_help" data-name="info/help" transform="translate(1 -1)">
          <text id="i" transform="translate(3 23)" fontSize="24" fontFamily="Arial-BoldMT, Arial" fontWeight="700"><tspan x="-3.334" y="0">i</tspan></text>
        </g>
      </svg>
    </SvgIcon>
  )
}

export const LanguageIcon = (props: DefaultComponentProps<SvgIconTypeMap>) => {
  return (
    <SvgIcon {...props} viewBox='0 0 23 23'>
      <svg xmlns="http://www.w3.org/2000/svg" width="22.721" height="22.724" viewBox="0 0 22.721 22.724">
        <g id="globe-icon" transform="translate(0 0)">
          <path id="Path_71" data-name="Path 71" d="M88.821-198.882a11.361,11.361,0,0,1,11.429-11.359,11.361,11.361,0,0,1,11.292,11.4,11.364,11.364,0,0,1-11.381,11.322A11.365,11.365,0,0,1,88.821-198.882Zm3.3-5.819a9.911,9.911,0,0,0-1.868,5.319H94.03c.026-.329.044-.65.079-.969a13.877,13.877,0,0,1,.628-2.9c.026-.079,0-.1-.065-.129a13.747,13.747,0,0,1-1.668-.8C92.711-204.343,92.424-204.52,92.119-204.7Zm17.993,5.322a9.923,9.923,0,0,0-1.874-5.33,14.83,14.83,0,0,1-2.639,1.372,14.211,14.211,0,0,1,.727,3.958Zm-16.079,1H90.251a9.919,9.919,0,0,0,1.874,5.329,14.875,14.875,0,0,1,2.608-1.359,14.077,14.077,0,0,1-.492-1.956A14.072,14.072,0,0,1,94.033-198.38Zm11.6,3.952c.453.215.9.411,1.33.635s.852.48,1.284.726a9.906,9.906,0,0,0,1.862-5.315H106.33a14.207,14.207,0,0,1-.206,2A14.1,14.1,0,0,1,105.636-194.428Zm-5.952-3.951H95.017a13.146,13.146,0,0,0,.642,3.636,14.76,14.76,0,0,1,4.026-.705Zm.995,2.931a14.736,14.736,0,0,1,4.026.7,13.116,13.116,0,0,0,.641-3.634h-4.667Zm-4.988-7.557a13.135,13.135,0,0,0-.67,3.627h4.661v-2.934a14.318,14.318,0,0,1-2.017-.207A14.6,14.6,0,0,1,95.691-203.005Zm8.982,0a14.907,14.907,0,0,1-1.972.485,14.9,14.9,0,0,1-2.018.209v2.929h4.66A13.2,13.2,0,0,0,104.673-203Zm-3.991,8.54v5.509a.421.421,0,0,0,.308-.074,13.22,13.22,0,0,0,3.136-4.243c.083-.178.159-.359.242-.547A13.718,13.718,0,0,0,100.681-194.465Zm-1,0a13.724,13.724,0,0,0-3.673.641.142.142,0,0,0,0,.032c.01.027.02.054.031.08a13.21,13.21,0,0,0,3.3,4.655.394.394,0,0,0,.341.1Zm4.637-9.46c-.011-.031-.016-.049-.024-.066a13.08,13.08,0,0,0-3.48-4.774.475.475,0,0,0-.137-.054v5.524A13.727,13.727,0,0,0,104.321-203.925Zm-4.637-4.9a.805.805,0,0,0-.147.071c-.08.063-.154.133-.229.2a13.132,13.132,0,0,0-3.217,4.5c-.017.039-.031.08-.046.119a13.284,13.284,0,0,0,3.639.626Zm7.935,3.349a9.974,9.974,0,0,0-2.341-1.94,9.533,9.533,0,0,0-2.8-1.126,15.086,15.086,0,0,1,1.574,2.017,14.376,14.376,0,0,1,1.2,2.269A13.635,13.635,0,0,0,107.618-205.478Zm-12.508,1.22a14.311,14.311,0,0,1,1.193-2.265,15.125,15.125,0,0,1,1.579-2.024,9.9,9.9,0,0,0-5.139,3.067A13.581,13.581,0,0,0,95.11-204.258Zm10.18,10.775a14.466,14.466,0,0,1-2.672,4.236,9.89,9.89,0,0,0,5-3.025A12.65,12.65,0,0,0,105.29-193.483Zm-7.543,4.236a15.269,15.269,0,0,1-1.519-2,14.209,14.209,0,0,1-1.156-2.242,13.582,13.582,0,0,0-2.328,1.207A9.9,9.9,0,0,0,97.747-189.247Z" transform="translate(-88.821 210.241)" />
        </g>
      </svg>
    </SvgIcon>
  )
}

export const ReCenterIcon = (props: DefaultComponentProps<SvgIconTypeMap>) => {
  return (
    <SvgIcon {...props} viewBox='0 0  42 42'>
      <svg id="re-center" xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
        <circle id="Ellipse_7" data-name="Ellipse 7" cx="21" cy="21" r="21" opacity="0.3" />
        <path id="Path_61" data-name="Path 61" d="M3903.884,793.881l-1.209-3-3.332,8.195,8.195-3.332-3-1.21,4.023-4.023-.657-.657Z" transform="translate(-3875.06 -781.362)" fill="#fff" opacity="0.8" />
        <path id="Path_62" data-name="Path 62" d="M3665.332,1032.433l-4.023,4.023.656.657,4.023-4.023,1.209,3,3.332-8.195-8.195,3.332Z" transform="translate(-3652.813 -1003.609)" fill="#fff" opacity="0.8" />
        <path id="Path_63" data-name="Path 63" d="M3907.537,1031.223l-8.195-3.332,3.332,8.195,1.209-3,4.023,4.023.657-.657-4.023-4.023Z" transform="translate(-3875.06 -1003.609)" fill="#fff" opacity="0.8" />
        <path id="Path_64" data-name="Path 64" d="M3665.989,793.881l-4.023-4.023-.656.657,4.023,4.023-3,1.21,8.195,3.332-3.332-8.195Z" transform="translate(-3652.813 -781.362)" fill="#fff" opacity="0.8" />
        <circle id="Ellipse_6" data-name="Ellipse 6" cx="2.163" cy="2.163" r="2.163" transform="translate(18.837 18.837)" fill="#fff" opacity="0.8" />
      </svg>
    </SvgIcon>
  )
}

export const AppArrowUpIcon = ({ strokeColor, ...props }: DefaultComponentProps<SvgIconTypeMap> & { strokeColor?: string }) => {
  return (
    <SvgIcon {...props} viewBox='0 0 66.959 16.59'>
      <path id="Path_70" data-name="Path 70" d="M2497.675-477.937l29.651-9.8,29.729,9.8" transform="translate(-2493.885 490.737)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
    </SvgIcon>
  )
}

export const ProductFinderSettingIcon = ({ strokeColor, ...props }: DefaultComponentProps<SvgIconTypeMap> & { strokeColor?: string }) => {
  return (
    <SvgIcon {...props} viewBox='0 0 18.933 15.741'>
      <svg id="Group_34" data-name="Group 34" xmlns="http://www.w3.org/2000/svg" width="18.933" height="15.741" viewBox="0 0 18.933 15.741">
        <defs>
          <clipPath id="clip-path">
            <rect id="Rectangle_25" data-name="Rectangle 25" width="18.933" height="15.741" />
          </clipPath>
        </defs>
        <g id="Group_33" data-name="Group 33" clipPath="url(#clip-path)">
          <path id="Path_77" data-name="Path 77" d="M.656,3.279H2.814a2.624,2.624,0,0,0,5.082,0H18.277a.656.656,0,0,0,0-1.312H7.9a2.624,2.624,0,0,0-5.082,0H.656a.656.656,0,1,0,0,1.312m4.7-1.968A1.312,1.312,0,1,1,4.044,2.624,1.313,1.313,0,0,1,5.355,1.312" />
          <path id="Path_78" data-name="Path 78" d="M18.277,101.968h-1.56a2.624,2.624,0,0,0-5.082,0H.656a.656.656,0,0,0,0,1.312h10.98a2.624,2.624,0,0,0,5.082,0h1.56a.656.656,0,0,0,0-1.312m-4.1,1.968a1.312,1.312,0,1,1,1.312-1.312,1.313,1.313,0,0,1-1.312,1.312" transform="translate(0 -94.753)" />
          <path id="Path_79" data-name="Path 79" d="M18.277,201.968H9.7a2.624,2.624,0,0,0-5.082,0H.656a.656.656,0,0,0,0,1.312H4.617a2.624,2.624,0,0,0,5.082,0h8.578a.656.656,0,0,0,0-1.312M7.158,203.935a1.312,1.312,0,1,1,1.312-1.312,1.313,1.313,0,0,1-1.312,1.312" transform="translate(0 -189.506)" />
        </g>
      </svg>
    </SvgIcon>
  )
};

export const AppArrowLeftIcon = ({ strokeColor, ...props }: DefaultComponentProps<SvgIconTypeMap> & { strokeColor?: string }) => {
  return (
    <SvgIcon {...props} viewBox='0 0 21.004 84.676'>
      <svg xmlns="http://www.w3.org/2000/svg" width="21.004" height="84.676" viewBox="0 0 21.004 84.676">
        <path id="arrow_left" data-name="arrow left" d="M0,14.152,38.437,0,76.974,14.152" transform="translate(3 80.824) rotate(-90)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
      </svg>
    </SvgIcon>
  )
};

export const AppArrowLeftSquareIcon = ({ strokeColor, ...props }: DefaultComponentProps<SvgIconTypeMap> & { strokeColor?: string }) => (
  <SvgIcon {...props} viewBox='0 0 15.556 15.556'>
    <path id="back-arrow" d="M0,10V0H10" transform="translate(1.414 7.778) rotate(-45)" fill="none" stroke={strokeColor || "#fff"} strokeWidth="2" />
  </SvgIcon>
);

export const AppCameraSquareIcon = ({ strokeColor, ...props }: DefaultComponentProps<SvgIconTypeMap> & { strokeColor?: string }) => (
  <SvgIcon {...props} width="265" height="265" viewBox="0 0 265 265">
    <g id="camera-square" transform="translate(2.5 2.5)">
      <path id="Path_1" d="M479.732,425.721h-31.5a50.909,50.909,0,0,1-50.909-50.91v-31.5" transform="translate(-397.326 -165.721)" fill="none" strokeLinecap="round" strokeMiterlimit="10"/>
      <path id="Path_2" d="M671.834,343.314v31.5a50.91,50.91,0,0,1-50.91,50.91h-31.5" transform="translate(-411.834 -165.721)" fill="none" strokeLinecap="round" strokeMiterlimit="10"/>
      <path id="Path_3" d="M589.427,151.213h31.5a50.91,50.91,0,0,1,50.91,50.909v31.5" transform="translate(-411.834 -151.213)" fill="none" strokeLinecap="round" strokeMiterlimit="10"/>
      <path id="Path_4" d="M397.326,233.619v-31.5a50.909,50.909,0,0,1,50.909-50.909h31.5" transform="translate(-397.326 -151.213)" fill="none" strokeLinecap="round" strokeMiterlimit="10"/>
    </g>
  </SvgIcon>
);

export const PaletteIcon = ({ strokeColor, ...props }: DefaultComponentProps<SvgIconTypeMap> & { strokeColor?: string }) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g>
        <g>
          <path d="M19.54 5.08A10.61 10.61 0 0 0 11.91 2a10 10 0 0 0-.05 20 2.58 2.58 0 0 0 2.53-1.89 2.52 2.52 0 0 0-.57-2.28.5.5 0 0 1 .37-.83h1.65A6.15 6.15 0 0 0 22 11.33a8.48 8.48 0 0 0-2.46-6.25zM15.88 15h-1.65a2.49 2.49 0 0 0-1.87 4.15.49.49 0 0 1 .12.49c-.05.21-.28.34-.59.36a8 8 0 0 1-7.82-9.11A8.1 8.1 0 0 1 11.92 4H12a8.47 8.47 0 0 1 6.1 2.48 6.5 6.5 0 0 1 1.9 4.77A4.17 4.17 0 0 1 15.88 15z" />
          <circle cx="12" cy="6.5" r="1.5" />
          <path d="M15.25 7.2a1.5 1.5 0 1 0 2.05.55 1.5 1.5 0 0 0-2.05-.55zm-6.5 0a1.5 1.5 0 1 0 .55 2.05 1.5 1.5 0 0 0-.55-2.05zm-2.59 4.06a1.5 1.5 0 1 0 2.08.4 1.49 1.49 0 0 0-2.08-.4z" />
        </g>
      </g>
    </SvgIcon>
  )
};
