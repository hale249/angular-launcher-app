"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDataDir = exports.DataDirTesting = void 0;
const electron_1 = require("electron");
const index_1 = require("./index");
const Fs = require("fs");
const fsJetpack = require("fs-jetpack");
class DataDirTesting {
    GetConfigDir() {
        return index_1.executableFolder.dir("config").dir('test');
    }
    GetTmpDir() {
        return index_1.executableFolder.dir("tmp");
    }
}
exports.DataDirTesting = DataDirTesting;
function showMessage(title, message) {
    electron_1.app.on("ready", () => {
        // dialog.showMessageBox({
        //   title: `Miraway CETM: ${title}`,
        //   message: message,
        //   buttons: ["Exit now"]
        // });
        electron_1.app.quit();
    });
}
class DefaultDataDir {
    constructor() {
        this.programData = `C:\\ProgramData\\${index_1.packageJson.author}\\${index_1.packageJson.productName}`;
        this.publicData = `C:\\${index_1.packageJson.author}\\${index_1.packageJson.productName}`;
    }
    GetConfigDir() {
        const jetPublicData = fsJetpack.cwd(this.publicData);
        const jetProgramData = fsJetpack.cwd(this.programData);
        const oldConfig = jetProgramData.path('config');
        const newConfig = jetPublicData.path('config');
        if (Fs.existsSync(oldConfig) && !Fs.existsSync(newConfig)) {
            try {
                // copy old data to the new public folder
                jetProgramData.copy("config", newConfig);
            }
            catch (e) {
                const message = `Please manually copy the config folder from ${oldConfig} to ${newConfig}`;
                showMessage("mirgation failed", message);
            }
        }
        return jetPublicData.dir("config");
    }
    GetTmpDir() {
        const jetPublicData = fsJetpack.cwd(this.publicData);
        return jetPublicData.dir("tmp");
    }
}
function GetDataDir() {
    // if (!isProduction) {
    return new DataDirTesting();
    // }
    //
    // const dataDirFromEnv = new DataDirFrmEnv();
    // if (dataDirFromEnv.IsValid()) {
    //   return dataDirFromEnv;
    // }
    // return new DefaultDataDir();
}
exports.GetDataDir = GetDataDir;
//# sourceMappingURL=data.js.map