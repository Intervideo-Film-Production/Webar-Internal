import React, { FC } from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { useAppContext } from 'src/core/events';
import { AppPages } from './routeMap';
import {
  useLocation
} from 'react-router-dom';
import queryString from 'query-string';
import { useBoundStore } from 'src/core/store';

const loginEnabled = process.env.REACT_APP_ENABLE_LOGIN === "TRUE";

const RouteWithRedirect = ({ component: Component, ...props }: { component: FC<any> } & RouteComponentProps) => {
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

  return !storeData ? (<Redirect
    to={{
      pathname: AppPages.InitialPage,
      ...(qrId ? { search: `?sid=${qrId}` } : {}),
      state: { from: props.location }
    }} />)
    : !loginEnabled || (username === 'braun' && password === 'intervideo')
      ? (<Component {...props} />)
      : (<Redirect
        to={{
          pathname: AppPages.LoginPage,
          state: { from: props.location }
        }} />)
}

const PrivateRoute = ({ component, ...rest }: { component: FC<any> } & RouteProps) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<RouteWithRedirect component={component} {...props} />)
      }}
    ></Route>
  )
}

export default PrivateRoute;
