import React, { useMemo } from 'react';
import { ButtonActionTypes } from 'src/core/declarations/enum';
import { useBoundStore } from 'src/core/store';
import ButtonDrawerContent from './ButtonDrawerContent';
import ButtonPopupContent from './ButtonPopupContent';

interface IButtonContentProps {
  buttonName: string;
  onToggle?: (buttonName: string) => any;
  onShowBeardStyle?: (beardStyle: string) => void;
}

const ButtonContent: React.FC<IButtonContentProps> = ({ buttonName, onToggle, onShowBeardStyle }) => {
  const buttons = useBoundStore(state => state.buttons);

  const button = useMemo(() => {
    return buttons?.find(btn => btn.buttonName === buttonName);
  }, [buttons, buttonName])

  if (button?.actionType === ButtonActionTypes.DisplayProductFeatures) {
    return (<ButtonDrawerContent
      buttonName={buttonName}
      onToggle={onToggle}
      onShowBeardStyle={onShowBeardStyle}
    />)
  }

  if (button?.actionType === ButtonActionTypes.CustomContent) {
    return <ButtonPopupContent open={!!buttonName && button?.actionType === ButtonActionTypes.CustomContent} onToggle={onToggle} content={button.customContent} />
  }

  if (button?.actionType === ButtonActionTypes.GiveACall) { }

  if (button?.actionType === ButtonActionTypes.Link) { }

  if (button?.actionType === ButtonActionTypes.WatchVideo) {
    return <ButtonPopupContent open={!!buttonName && button?.actionType === ButtonActionTypes.WatchVideo} onToggle={onToggle} video={button.videoContent} />
  }

  return <></>;
}

export default ButtonContent;

