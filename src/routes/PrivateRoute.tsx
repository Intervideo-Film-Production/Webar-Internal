import React, { FC } from 'react';
import { useQueryClient } from 'react-query';
import { Navigate, Route, RouteProps } from 'react-router-dom';
import { useAppContext } from 'src/core/store';
import { QueryKeys } from '../core/declarations/enum';
import { AppPages } from './routeMap';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const loginEnabled = process.env.REACT_APP_ENABLE_LOGIN === "TRUE";

const RouteWithRedirect = ({ element }: { element: JSX.Element }) => {
  const queryClient = useQueryClient();
  const qrCodeData = queryClient.getQueryData(QueryKeys.qrCode);
  const { appCredential } = useAppContext();
  const { username, password } = appCredential.getValue();
  const location = useLocation();

  let qrId = null;
  if (!qrCodeData) {
    let { sid } = queryString.parse(location.search) as { sid: string | null };
    // if application is accessed from anywhere in the app rather than initialize page, sid should be checked and passed to redirect link
    if (sid) {
      qrId = sid;
    }
  }

  return !qrCodeData ? (<Navigate
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
