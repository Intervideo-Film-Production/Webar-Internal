import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@mui/material';

interface AppButtonProps {
  startIcon?: React.ReactNode;
  endIcon?: JSX.Element;
  children?: React.ReactNode;
  hasBoxShadow?: boolean;
}
/**
 * AppButton should be used instead of the default material Button component
 * in order to fix Helvetica Neuve LT Pro font issues
*/
const AppButton = forwardRef<HTMLButtonElement, AppButtonProps & ButtonProps>(({ children, hasBoxShadow = false, sx, startIcon, endIcon, ...props }: AppButtonProps & ButtonProps, ref) => {
  return (
    <Button
      ref={ref}
      sx={(typeof sx === 'function') ? (theme => ({
        ...(hasBoxShadow ? {} : { boxShadow: 'none' }),
        ...sx(theme)
      })) : {
        ...sx,
        ...(hasBoxShadow ? {} : { boxShadow: 'none' })
      }}
      {...props}
    >
      {!!startIcon && startIcon}
      <span className="button-text">{children}</span>
      {!!endIcon && endIcon}
    </Button>
  )
})

export default AppButton;
