import { Theme } from '@mui/material';
import { createContext, useContext } from 'react';
import { BehaviorSubject, Subject } from 'rxjs';

interface ICredential { username: string, password: string };
export class AppStore {
  // trigger page loading screen
  appLoadingStateEvent = new BehaviorSubject<boolean>(false);
  headerToggleEvent = new Subject<boolean>();
  productClaimToggleEvent = new Subject<boolean>();
  arResourcesLoadEvent = new Subject<boolean>();
  // change name to support non-model based products
  aFrameModelLoadedEvent = new Subject<any>();
  initialPageUrl = new BehaviorSubject<string>('');
  // FIXME temp credential
  appCredential: BehaviorSubject<ICredential> = new BehaviorSubject({ username: '', password: '' });
  appTheme: BehaviorSubject<Theme> = new BehaviorSubject({} as Theme);
}

export const Context = createContext<AppStore>(new AppStore());

export const useAppContext = (): AppStore => useContext(Context);
