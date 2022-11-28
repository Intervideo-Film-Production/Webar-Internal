import React, { useEffect, useMemo, useState } from 'react';
import AppRouter from './routes/AppRouter';
import { InitialPage } from './containers';
import { LoadingBox } from './components';
import { Route, BrowserRouter, Switch, withRouter } from 'react-router-dom';
import { AppPages } from './routes/routeMap';
import { getRootSubPath, useTrackBrowserHeight } from './core/helpers';
import { AppStore, Context, useAppContext } from 'src/core/events';

const appStore = new AppStore();


const Wrapper = withRouter(() => {
  const { appLoadingStateEvent } = useAppContext();
  const [isAppLoading, setIsAppLoading] = useState(false);

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
      <Switch>
        <Route path={AppPages.InitialPage} component={InitialPage} />
        <AppRouter />

      </Switch>

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
});

function App() {
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
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </Context.Provider>
  );
}

export default App;
