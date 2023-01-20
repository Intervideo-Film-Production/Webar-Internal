import { RouteObject } from "react-router-dom";
import {
  ARPage,
  HomePage,
  ScanPage,
  ProductFinder,
  AllowScanPage,
  InitialPage,
  CategorySelection
} from "../containers";
import AppRouter from "./AppRouter";
/**
 * WARNING: for further development, check deployment scenario before developing nested routes
 * currently the app is deployed to a NGINX subpath thus it gets the subpath window.location to serve as BrowserRouter's basename
 * the current solution may not apply with nested routing scenario
 * see helpers.tsx / getRootSubPath function for current solution
*/
export const AppPages = {
  HomePage: '/',
  InitialPage: '/initialize',
  LoginPage: '/login',
  StorePage: '/store',
  ARPage: '/ar-page',
  ScanPage: '/scan-page',
  Categories: '/categories',
  ProductFinderPage: '/product-finder',
  AllowScanPage: '/allow-scan',
};

const routeMaps: RouteObject[] = [
  {
    path: AppPages.InitialPage,
    element: <InitialPage />
  },
  {
    path: "/",
    element: <AppRouter />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: AppPages.ScanPage,
        element: <ScanPage />
      },
      {
        path: AppPages.ARPage,
        element: <ARPage />
      },
      {
        path: AppPages.Categories,
        element: <CategorySelection />
      },
      {
        path: AppPages.ProductFinderPage,
        element: <ProductFinder />
      },
      {
        path: AppPages.AllowScanPage,
        element: <AllowScanPage />
      }
    ]
  }
];

export default routeMaps;
