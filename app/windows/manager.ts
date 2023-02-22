import { BehaviorSubject } from 'rxjs';
import { ConfigStore } from './config';
import { Store } from '../shared';
import { jetConfigDir, COMMON_DIR, XBrowserWindow, preloadFile, IAppConfig, Hub$ } from '../shared';

export class AppManager {
  constructor() {
    this.CStore = new ConfigStore();
    this.CStore.Apps.forEach(app => {
      if (app.autostart) {
        this.Open(app.id);
      }
    });
  }

  protected GetWebPreferences() {

    const webPreferences: Electron.WebPreferences = {
      nodeIntegration: false,
      preload: preloadFile
    }

    return webPreferences;

  }

  CStore: ConfigStore;
  private children: { [index: string]: XBrowserWindow } = {};

  Open(appID: string) {
    const app = this.CStore.GetApp(appID);
    if (!app || !app.id) {
      return;
    }
    if (this.children[app.id]) {
      this.children[app.id].Focus();
      return this.children[app.id];
    }
    const win = new XBrowserWindow(app, {
      webPreferences: this.GetWebPreferences()
    });
    win.win.on('closed', () => {
      // safely close the app
      delete this.children[app.id];
    });
    this.children[app.id] = win;
    this.onChildChange();
    return win;
  }

  ClearBrowserCache(appID: string){
    let child = this.children[appID];
    if (child) {
      child.ClearBrowserCache()
      child.Reload();
    }
  }

  ClearLocalConfig(appID: string){
    let store = new Store(appID, {}, jetConfigDir.path('runtime'))
    store.Remove()
  }

  Delete(appID: string) {
    this.CStore.DeleteApp(appID);
  }

  Close(appID: string) {
    let child = this.children[appID];
    if (child) {
      child.Close();
    }
    delete this.children[appID];
    this.onChildChange();
  }

  Debug(appID: string) {
    const win = this.Open(appID);
    if (win) {
      win.Dev();
    }
  }

  CloseAll() {
    Object.keys(this.children).forEach(c => {
      this.children[c].Close();
    });
    this.onChildChange();
  }

  private onChildChange() {
    const children = Object.keys(this.children).map(id => {
      return this.children[id].Config();
    });
    this.Children$.next(children);
  }

  protected Broadcast(uri: string, data: any, skip?: string) {
    Object.keys(this.children).forEach(id => {
      const c = this.children[id];
      c.Send(uri, data);
    });
  }

  Children$ = new BehaviorSubject<IAppConfig[]>([]);
}

