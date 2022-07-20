import { ARPage, HomePage, ScanPage, ProductFinder,AllowScanPage} from "../containers";
import { IAppRoute } from "../core/declarations/app";
/**
 * WARNING: for further development, check deployment scenario before developing nested routes
 * currently the app is deployed to a NGINX subpath thus it gets the subpath window.location to serve as BrowserRouter's basename
 * the current solution may not apply with nested routing scenario
 * see helpers.tsx / getRootSubPath function for current solution
*/
export const AppPages = {
  InitialPage: '/initialize',
  LoginPage: '/login',
  HomePage: '/',
  StorePage: '/store',
  ARPage: '/ar-page',
  ScanPage: '/scan-page',
  ProductFinderPage: '/product-finder',
  // AllowScanPage:'/allow-scan',
};

const routeMaps: IAppRoute[] = [
  {
    path: AppPages.InitialPage,
    exact: true,
    component: HomePage
  },
  {
    path: AppPages.ScanPage,
    component: ScanPage
  },
  {
    path: AppPages.ARPage,
    component: ARPage
  },
  {
    path: AppPages.ProductFinderPage,
    component: ProductFinder
  },
  // {
  //   path: AppPages.AllowScanPage,
  //   component: AllowScanPage
  // }
];

export default routeMaps;
