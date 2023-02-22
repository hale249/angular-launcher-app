import {app} from "electron";
import {executableFolder, packageJson} from "./index";
import * as Fs from "fs";
import * as fsJetpack from 'fs-jetpack';
// import dialog = Electron.Main.dialog;

export interface DataDir {
  GetConfigDir(): any;
  GetTmpDir(): any;
}

export class DataDirTesting implements DataDir {
  GetConfigDir() {
    return executableFolder.dir("config").dir('test');
  }

  GetTmpDir() {
    return executableFolder.dir("tmp");
  }
}

function showMessage(title: string, message: string) {
  app.on("ready", () => {
    // dialog.showMessageBox({
    //   title: `Miraway CETM: ${title}`,
    //   message: message,
    //   buttons: ["Exit now"]
    // });

    app.quit();
  });
}

class DefaultDataDir implements DataDir {
  private programData = `C:\\ProgramData\\${packageJson.author}\\${packageJson.productName}`;
  private publicData = `C:\\${packageJson.author}\\${packageJson.productName}`;

  GetConfigDir(): any {
    const jetPublicData = fsJetpack.cwd(this.publicData);
    const jetProgramData = fsJetpack.cwd(this.programData);
    const oldConfig = jetProgramData.path('config');
    const newConfig = jetPublicData.path('config');
    if (Fs.existsSync(oldConfig) && !Fs.existsSync(newConfig)) {
      try {
        // copy old data to the new public folder
        jetProgramData.copy("config", newConfig);
      } catch (e) {
        const message = `Please manually copy the config folder from ${oldConfig} to ${newConfig}`;
        showMessage("mirgation failed", message);
      }
    }
    return jetPublicData.dir("config");
  }

  GetTmpDir(): any {
    const jetPublicData = fsJetpack.cwd(this.publicData);
    return jetPublicData.dir("tmp");
  }

}

export function GetDataDir(): DataDir {
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
