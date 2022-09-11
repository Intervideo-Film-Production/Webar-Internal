import React, { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppRouter from './routes/AppRouter';
import { InitialPage, LoginPage } from './containers';
import { LoadingBox } from './components';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import routeMaps, { AppPages } from './routes/routeMap';
import { getRootSubPath, useTrackBrowserHeight } from './core/helpers';
import { AppStore, Context, useAppContext } from 'src/core/store';
import RouteWithRedirect from './routes/PrivateRoute';
import { ReactQueryDevtools } from 'react-query/devtools';

const loginEnabled = process.env.REACT_APP_ENABLE_LOGIN === "TRUE";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
});

const appStore = new AppStore();


const Wrapper = () => {
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
      <Routes>
        <Route path={AppPages.InitialPage} element={<InitialPage />} />
        <Route path="/" element={<AppRouter />}>
          {routeMaps.map((route, idx) => <Route key={`route-${idx}`}
            path={route.path}
            element={<RouteWithRedirect element={route.element} />}
          />)}
          {loginEnabled && (
            <Route path={AppPages.LoginPage} element={<LoginPage />} />
          )}
        </Route>
      </Routes>

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
  const currentRootPath = useMemo(() => getRootSubPath(), []);
  // browser resize event should be bound here to avoid muiltiple executions
  useTrackBrowserHeight();

  return (
    <Context.Provider value={appStore}>
      <QueryClientProvider client={queryClient}>
        <React.Suspense fallback={<LoadingBox sx={{ height: '100%' }} />}>
          <BrowserRouter basename={currentRootPath}>
            <Wrapper />
          </BrowserRouter>
        </React.Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Context.Provider>

  );
}

export default App;
