import { Injectable, FactoryProvider } from '@angular/core';
import { Subject } from 'rxjs';
import { IAppRuntime, IAppConfig, IUpdate } from './model';

abstract class ConfigStore {
  GetAllApps(): IAppConfig[] {
    return [];
  }

  GetApp(id: string): IAppConfig {
    return null;
  }

  SaveApp(app: IAppConfig) { }

  DeleteApp(id: string) {
  }

  SaveUpdate(update: IUpdate) {

  }

  state: any;
}

export interface IVersionInfo {
  githubArtifactName: string;
  path: string;
  releaseDate: string; //"2017-04-14T06:41:31.344Z"
  sha2: string;
  version: string;
}

export interface IUpdateResponse {
  data?: {
    versionInfo: IVersionInfo;
  };
  error?: string;
}

class Updater {
  CurrentVersion() {
    return '';
  }
  CheckForUpdates() {
    return Promise.resolve<IUpdateResponse>(null);
  }
  QuitAndInstall() {

  }
  NewVersion$ = new Subject<string>();
}

@Injectable()
export class XWinService {

  onInit() {

  }

  CStore: ConfigStore;

  Open(id: string) { }
  ClearLocalConfig(id: string) {}
  ClearBrowserCache(id: string) { }
  Close(id: string) { }
  Debug(id: string) { }
  Delete(id: string) { }
  Relaunch() { }
  Exit() { }
  updater = new Updater();
}

import { NativeService } from './native.service';

export function __xwin_factory(native: NativeService) {
  return native.qms.__x;
}

export const XWinServiceProvider = <FactoryProvider>{
  provide: XWinService,
  deps: [NativeService],
  useFactory: __xwin_factory
}
