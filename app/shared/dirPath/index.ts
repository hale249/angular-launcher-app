import {GetDataDir} from "./data";

const jetpack = require('fs-jetpack'); // module loaded from npm

import { dirname } from 'path';

export const appRoot = process.cwd();
export const appDir = dirname(require.main.filename);

export const jetAppDir = jetpack.cwd(appRoot);
export const executableFolder = jetpack.cwd(appRoot);

export const jetViewDir = jetAppDir.dir("renderer");
export const jetAssetDir = jetAppDir.dir("assets");
export const preloadFile = jetAppDir.path("preload/index.js");

const jetDataDir = GetDataDir();
export const jetConfigDir = jetDataDir.GetConfigDir();
export const jetTmpDir = jetDataDir.GetTmpDir();

export const COMMON_DIR = {
  ASSET: jetAssetDir.path(""),
  TMP: jetTmpDir.path(""),
  VIEW: jetViewDir.path("")
}


export const packageJson: { author: string, productName: string } = jetAppDir.read("package.json", "json");

