import React from 'react';

interface ITabPanelProps {
  children: React.ReactNode;
  value: number | string;
  index: number | string;
}

const TabPanel = (props: ITabPanelProps & React.HTMLAttributes<HTMLDivElement>) => {
  const { children, value, index, style, ...other } = props;

  return value === index
    ? (
      <div
        style={{
          display: 'grid',
          ...style,
        }}
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >

        {children}

      </div>
    )
    : (<></>)
}

export default TabPanel;
