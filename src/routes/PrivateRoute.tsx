import React from 'react';
import { AppPages } from './routeMap';
import { Navigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useBoundStore } from 'src/core/store';
import { useAppContext } from 'src/core/events';

const loginEnabled = process.env.REACT_APP_ENABLE_LOGIN === "TRUE";

const RouteWithRedirect = ({ element }: { element: JSX.Element }) => {
  const storeData = useBoundStore((state) => state.store);
  const { appCredential } = useAppContext();
  const { username, password } = appCredential.getValue();
  const location = useLocation();

  let qrId = null;
  if (!storeData) {
    let { sid } = queryString.parse(location.search) as { sid: string | null };
    // if application is accessed from anywhere in the app rather than initialize page, sid should be checked and passed to redirect link
    if (sid) {
      qrId = sid;
    }
  }

  return !storeData ? (<Navigate
    to={{
      pathname: AppPages.InitialPage,
      ...(qrId ? { search: `?sid=${qrId}` } : {}),
    }}
    state={{ from: location.pathname }}
  />)
    : !loginEnabled || (username === 'braun' && password === 'intervideo')
      ? (element)
      : (<Navigate
        to={{
          pathname: AppPages.LoginPage,
        }}
        state={{ from: location.pathname }}
      />)
}

export default RouteWithRedirect;
