import { Subscription } from 'rxjs';
import { BrowserWindow } from 'electron';
import { IAppConfig, IAppRuntime } from './model';
import { GetAppLink } from './category';
import { Store } from './store';
import { jetConfigDir, COMMON_DIR } from './dirPath';
import { Publish, Hub$ } from './hub';

export class XWinStore extends Store<IAppRuntime> {
  constructor(appID: string) {
    super(appID, {}, jetConfigDir.path('runtime'));
    this.Save("id", appID);
  }
}

export class XBrowserWindow {
  constructor(
    private config: IAppConfig,
    private options?: Electron.BrowserWindowConstructorOptions
  ) {
    this.win = new BrowserWindow(options);
    this.win['__x'] = this;
    if (this.config.debug) {
      this.Dev();
    }

    this.reload();
    if (!this.config.no_runtime) {
      this.runtime_store = new XWinStore(this.config.id);
    }


    this.win.on('closed', () => {
      this.Clean();
    })
  }

  win: Electron.BrowserWindow;
  protected runtime_store: XWinStore;
  private subsriptions: Subscription[] = [];
  private defaultMiniBound: Electron.Rectangle = {
    x: 0,
    y: 0,
    width: 305,
    height: 165
  }
  private miniBound: Electron.Rectangle;
  private mode: "mini" | "no" = "no";

  get debug() {
    return this.config.debug;
  }

  Dev() {
    this.win.show();
    this.Focus();
    this.win.webContents.openDevTools();
  }

  Focus() {
    this.win.focus();
  }

  Clean() {
    while (this.subsriptions.length) {
      const sub = this.subsriptions.pop();
      sub.unsubscribe();
    }
    this.mode = "no";
  }

  Close() {
    this.Clean();
    try {
      this.win.setClosable(true);
      this.win.close();
    } catch (e) {
      console.log("[browser-window] clsoe ", e);
    }
  }

  protected SetRuntime(key: string, value: string) {
    if (this.runtime_store) {
      this.runtime_store.Save(key, value);
    }
  }

  protected GetRuntime(key: string) {
    if (this.runtime_store) {
      return this.runtime_store.Get(key);
    }
    return "";
  }

  Send(event: string, data: any) {
    if (this.win.isDestroyed()) {
      console.error("target was destroyed");
      return;
    }
    this.win.webContents.send(event, data);
  }

  protected Broadcast(uri: string, data: any) {
    Publish(uri, data, this.config.id);
  }

  private reload() {
    this.win.loadURL(GetAppLink(this.config));
  }

  Reload(){
    this.reload();
  }

  ClearLocalConfig(){
    console.log('clear local config 4')
    this.runtime_store.Remove()
  }

  ClearBrowserCache(){
    this.win.webContents.session.clearCache();
    this.win.webContents.session.clearStorageData();
    this.win.webContents.clearHistory();
  }

  Config() {
    return this.config;
  }

  SetMiniMode(
    rect: Electron.Rectangle,
    minimize_now?: boolean,
    options?: { no_focusable: boolean, always_on_top: boolean, no_resizable: boolean }
  ) {
    this.win.setClosable(false);
    if (this.mode === "mini" || !rect) {
      return;
    }
    this.mode = "mini";
    this.miniBound = this.defaultMiniBound;

    if (minimize_now) {
      this.miniBound = this.getCurrentBound(this.miniBound);
      this.showMinimize(this.miniBound, options);
    }
  }

  private initWindow(options?: { no_focusable: boolean, always_on_top: boolean, no_resizable: boolean }) {
    this.win.on("minimize", event => {
      this.miniBound = this.getCurrentBound(this.miniBound);
      this.showMinimize(this.miniBound, options);
    });
    this.win.on("maximize", event => {
      this.win.setFocusable(true);
      this.win.setAlwaysOnTop(false);
      this.win.setResizable(true);
      this.Focus();
      this.win.setSkipTaskbar(false);
    });
    this.win.on('unmaximize', enent => {
      this.miniBound = this.getCurrentBound(this.miniBound);
      this.showMinimize(this.miniBound, options);
    })
  }

  private showMinimize(bounds: Electron.Rectangle, options?: { no_focusable: boolean, always_on_top: boolean, no_resizable: boolean }) {
    setTimeout(_ => {
      this.win.restore();
      setTimeout(_ => {
        this.win.setBounds(bounds);
        this.setOption(options);
      }, 10);
    }, 250);
  }

  SetFocusable(b: boolean) {
    this.win.setFocusable(b);
  }

  private getCurrentBound(miniBound) {
    let currentBound: Electron.Rectangle = this.win.getBounds();
    miniBound.x = currentBound.x;
    miniBound.y = currentBound.y;
    return miniBound;
  }

  private setOption(options) {
    options = options || <any>{};
    if (options.no_focusable) {
      this.win.setFocusable(false);
    }
    if (options.always_on_top) {
      this.win.setAlwaysOnTop(true);
    }
    if (options.no_resizable) {
      this.win.setResizable(false);
    }
    this.win.setSkipTaskbar(false);
  }

  protected DIR = COMMON_DIR;
}
