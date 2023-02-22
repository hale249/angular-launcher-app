"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const electron = require("electron");
const path = require("path");
const jetpack = require('fs-jetpack');
class Store {
    constructor(name, defaults, folder) {
        this.name = name;
        this.defaults = defaults;
        this.folder = folder;
        this.stateStoreFile = this.name + '.json';
        // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
        // app.getPath('userData') will return a string of the user's app data directory path.
        // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
        const userDataFolder = (electron.app || require('@electron/remote').app).getPath('userData');
        this.folder = this.folder || path.join(userDataFolder, "store");
        this.userDataDir = jetpack.cwd(this.folder);
        this.restore();
    }
    save() {
        try {
            this.userDataDir.write(this.stateStoreFile, this.state, { atomic: true });
        }
        catch (e) {
            console.log(`write to ${this.stateStoreFile} error`, e);
            electron.dialog.showErrorBox("Write failed", `Save configuration to ${this.stateStoreFile} failed. Try to restart using admin account`);
        }
    }
    remove() {
        try {
            this.userDataDir.remove(this.stateStoreFile);
            electron.dialog.showMessageBox(null, {
                "title": "Remove",
                "message": "Remove local config success"
            });
        }
        catch (e) {
            console.log(`remove file ${this.stateStoreFile} error`, e);
            electron.dialog.showErrorBox("Remove failed", `Remove configuration files ${this.stateStoreFile} failed. Try to restart using admin account`);
        }
    }
    restore() {
        let restoredState = {};
        try {
            restoredState = this.userDataDir.read(this.stateStoreFile, 'json');
        }
        catch (err) {
            // For some reason json can't be read (might be corrupted).
            // No worries, we have defaults.
        }
        this.state = Object.assign({}, this.defaults, restoredState);
    }
    ;
    Remove() {
        this.remove();
    }
    Save(key, value) {
        const current = this.state[key];
        if (current != value) {
            this.state[key] = value;
            this.save();
        }
    }
    Get(key) {
        return this.state[key];
    }
}
exports.Store = Store;
// expose the class
module.exports = Store;
//# sourceMappingURL=index.js.map