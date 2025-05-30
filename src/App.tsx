import React, { useEffect, useMemo, useState } from 'react';
import AppRouter from './routes/AppRouter';
import { InitialPage, LoginPage } from './containers';
import { LoadingBox } from './components';
import { Route, BrowserRouter, Routes, useRoutes } from 'react-router-dom';
import routeMaps, { AppPages } from './routes/routeMap';
import { getRootSubPath, useTrackBrowserHeight } from './core/helpers';
import { AppStore, Context, useAppContext } from './core/events';
import RouteWithRedirect from './routes/PrivateRoute';

const loginEnabled = process.env.REACT_APP_ENABLE_LOGIN === "TRUE";
const appStore = new AppStore();


const Wrapper = () => {
  const { appLoadingStateEvent } = useAppContext();
  const [isAppLoading, setIsAppLoading] = useState(false);
  const element = useRoutes(routeMaps);

  useEffect(() => {
    if (appLoadingStateEvent) {
      const subscription = appLoadingStateEvent.subscribe(isAppLoading => {
        setIsAppLoading(isAppLoading);
      });

      return () => {
        subscription.unsubscribe();
      }
    }
  }, [appLoadingStateEvent])

  return (
    <>
      {element}
      {isAppLoading && (<LoadingBox sx={{
        height: '100%',
        zIndex: 1060,
        position: 'fixed',
        backgroundColor: '#fff',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }} />)}

    </>
  )
};

function App() {
  // FIXME
  const currentRootPath = useMemo(() => getRootSubPath(), []);
  // browser resize event should be bound here to avoid muiltiple executions
  useTrackBrowserHeight();

  return (
    <Context.Provider value={appStore}>
      <React.Suspense fallback={<LoadingBox sx={{ height: '100%' }} />}>
        <BrowserRouter basename={currentRootPath}>
          <Wrapper />
        </BrowserRouter>
      </React.Suspense>
    </Context.Provider>
  );
}

export default App;
