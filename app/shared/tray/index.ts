import { Tray, Menu } from 'electron';
import { Subject } from 'rxjs';

export class XTray {
  constructor(private icon: string) {
    this.tray = new Tray(icon);
    this.tray.on("click", () => {
      this.Click$.next(null);
    });
  }

  SetToolTip(tooltip: string) {
    this.tray.setToolTip(tooltip);
  }

  SetContentMenu(menuItems: Electron.MenuItemConstructorOptions[] = []) {
    const menus = [].concat(this.items).concat(menuItems);
    menus.forEach(item => {
      item.click = () => this.Item$.next(item);
    });
    this.tray.setContextMenu(Menu.buildFromTemplate(menus));
  }

  Item$ = new Subject<Electron.MenuItemConstructorOptions>();
  Click$ = new Subject();

  ShowBalloon(title: string, content: string) {
    this.tray.displayBalloon({
      title: title,
      content: content
    });
  }

  private tray: Electron.Tray;
  private items: Electron.MenuItemConstructorOptions[] = [
    { id: "exit", label: "Exit" },
    { id: "restart", label: "Restart" }
  ]
}
