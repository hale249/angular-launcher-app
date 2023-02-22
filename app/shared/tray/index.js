"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XTray = void 0;
const electron_1 = require("electron");
const rxjs_1 = require("rxjs");
class XTray {
    constructor(icon) {
        this.icon = icon;
        this.Item$ = new rxjs_1.Subject();
        this.Click$ = new rxjs_1.Subject();
        this.items = [
            { id: "exit", label: "Exit" },
            { id: "restart", label: "Restart" }
        ];
        this.tray = new electron_1.Tray(icon);
        this.tray.on("click", () => {
            this.Click$.next(null);
        });
    }
    SetToolTip(tooltip) {
        this.tray.setToolTip(tooltip);
    }
    SetContentMenu(menuItems = []) {
        const menus = [].concat(this.items).concat(menuItems);
        menus.forEach(item => {
            item.click = () => this.Item$.next(item);
        });
        this.tray.setContextMenu(electron_1.Menu.buildFromTemplate(menus));
    }
    ShowBalloon(title, content) {
        this.tray.displayBalloon({
            title: title,
            content: content
        });
    }
}
exports.XTray = XTray;
//# sourceMappingURL=index.js.map