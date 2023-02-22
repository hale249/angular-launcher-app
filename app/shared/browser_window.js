"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XBrowserWindow = exports.XWinStore = void 0;
const electron_1 = require("electron");
const category_1 = require("./category");
const store_1 = require("./store");
const dirPath_1 = require("./dirPath");
const hub_1 = require("./hub");
class XWinStore extends store_1.Store {
    constructor(appID) {
        super(appID, {}, dirPath_1.jetConfigDir.path('runtime'));
        this.Save("id", appID);
    }
}
exports.XWinStore = XWinStore;
class XBrowserWindow {
    constructor(config, options) {
        this.config = config;
        this.options = options;
        this.subsriptions = [];
        this.defaultMiniBound = {
            x: 0,
            y: 0,
            width: 305,
            height: 165
        };
        this.mode = "no";
        this.DIR = dirPath_1.COMMON_DIR;
        this.win = new electron_1.BrowserWindow(options);
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
        });
    }
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
        }
        catch (e) {
            console.log("[browser-window] clsoe ", e);
        }
    }
    SetRuntime(key, value) {
        if (this.runtime_store) {
            this.runtime_store.Save(key, value);
        }
    }
    GetRuntime(key) {
        if (this.runtime_store) {
            return this.runtime_store.Get(key);
        }
        return "";
    }
    Send(event, data) {
        if (this.win.isDestroyed()) {
            console.error("target was destroyed");
            return;
        }
        this.win.webContents.send(event, data);
    }
    Broadcast(uri, data) {
        (0, hub_1.Publish)(uri, data, this.config.id);
    }
    reload() {
        this.win.loadURL((0, category_1.GetAppLink)(this.config));
    }
    Reload() {
        this.reload();
    }
    ClearLocalConfig() {
        console.log('clear local config 4');
        this.runtime_store.Remove();
    }
    ClearBrowserCache() {
        this.win.webContents.session.clearCache();
        this.win.webContents.session.clearStorageData();
        this.win.webContents.clearHistory();
    }
    Config() {
        return this.config;
    }
    SetMiniMode(rect, minimize_now, options) {
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
    initWindow(options) {
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
        });
    }
    showMinimize(bounds, options) {
        setTimeout(_ => {
            this.win.restore();
            setTimeout(_ => {
                this.win.setBounds(bounds);
                this.setOption(options);
            }, 10);
        }, 250);
    }
    SetFocusable(b) {
        this.win.setFocusable(b);
    }
    getCurrentBound(miniBound) {
        let currentBound = this.win.getBounds();
        miniBound.x = currentBound.x;
        miniBound.y = currentBound.y;
        return miniBound;
    }
    setOption(options) {
        options = options || {};
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
}
exports.XBrowserWindow = XBrowserWindow;
//# sourceMappingURL=browser_window.js.map