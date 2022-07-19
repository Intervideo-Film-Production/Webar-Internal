import React, { useEffect } from 'react';
import { filter, map, take } from 'rxjs';
import { useAppContext } from 'src/core/store';

export const FontLoader = () => {
  const { appTheme } = useAppContext();
  useEffect(() => {
    const subscription = appTheme.pipe(
      filter(theme => !!theme.fontSetting),
      map(theme => theme.fontSetting),
      take(1)
    ).subscribe(fontSetting => {
      const styleHtml = fontSetting.map(({ fontFamily, fontStyle, fontWeight, fontUrl }) => {
        const fontFormat = /^\S*\.(ttf|woff)$/gi.exec(fontUrl);
        const correctFormat = fontFormat && fontFormat[1];
        return !!correctFormat ? `
          @font-face {
            font-family: ${fontFamily};
            font-style: ${fontStyle};
            font-weight: ${fontWeight};
            src: url(${fontUrl});
          } 
        `: ''
      }).join(' ');

      if (!!styleHtml) {
        const newStyleEl = document.createElement('style');
        newStyleEl.innerHTML = styleHtml;
        document.head.insertAdjacentElement('beforeend', newStyleEl);
      }

    })

    return () => { subscription.unsubscribe(); }

  }, [appTheme])
  return (<></>)
}
