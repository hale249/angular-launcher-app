import * as electron from 'electron';
import { AppManager } from './manager';
import { COMMON_DIR, jetAppDir, jetAssetDir, XTray, XBrowserWindow, Hub$, IAppConfig } from '../shared';
const iconFile = jetAssetDir.path("./build/icon.ico");

export class AdminWindow extends AppManager {
  constructor() {
    super();
    this.win = new electron.BrowserWindow({
      width: 600,
      height: 600,
      skipTaskbar: true,
      webPreferences: this.GetWebPreferences()
    });

    this.win['__x'] = this;
    this.win.loadURL(jetAppDir.path("admin/index.html"));
    this.win.hide();
    this.tray.SetContentMenu();
    this.tray.Click$.subscribe(_ => {
      this.Restore();
    });
    this.tray.Item$.subscribe(item => {
      this.handleItemClick(item);
    });

    this.win.on("close", (e) => {
      e.preventDefault();
      this.win.hide();
    });

    Hub$.subscribe(arg => {
      this.Broadcast(arg.uri, arg.data);
    });
    // this.updater.CheckUpdateResult$.subscribe(res => {
    //   this.Send("/updater/check_update_result", res);
    // });
    // this.updater.NewVersion$.subscribe(version => {
    //   this.Send("/updater/ready_to_install", version);
    // });
    // this.updater.Progress$.subscribe(data => {
    //   this.Send("/updater/progress", data);
    // });
    // this.updater.Installing$.subscribe(wait => {
    //   this.Send("/updater/installing", wait);
    // })
  }

  Relaunch() {
    electron.app.relaunch();
    this.Exit();
  }

  Exit() {
    this.CloseAll();
    electron.app.exit();
  }

  win: Electron.BrowserWindow;
  tray = new XTray(iconFile);

  Restore() {
    if (this.win.isMinimized()) {
      this.win.restore();
    }
    this.win.show();
    this.win.focus();
  }

  private handleItemClick(item: Electron.MenuItemConstructorOptions) {
    switch (item.id) {
      case "exit":
        this.Exit();
        break;
      case "restart":
        this.Relaunch();
        break;
    }
  }

  Send(event: string, data: any) {
    if (this.win.isDestroyed()) {
      console.error("target was destroyed");
      return;
    }
    this.win.webContents.send(event, data);
  }

  private DIR = COMMON_DIR;
}

