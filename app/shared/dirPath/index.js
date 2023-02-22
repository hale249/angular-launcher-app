"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageJson = exports.COMMON_DIR = exports.jetTmpDir = exports.jetConfigDir = exports.preloadFile = exports.jetAssetDir = exports.jetViewDir = exports.executableFolder = exports.jetAppDir = exports.appDir = exports.appRoot = void 0;
const data_1 = require("./data");
const jetpack = require('fs-jetpack'); // module loaded from npm
const path_1 = require("path");
exports.appRoot = process.cwd();
exports.appDir = (0, path_1.dirname)(require.main.filename);
exports.jetAppDir = jetpack.cwd(exports.appRoot);
exports.executableFolder = jetpack.cwd(exports.appRoot);
exports.jetViewDir = exports.jetAppDir.dir("renderer");
exports.jetAssetDir = exports.jetAppDir.dir("assets");
exports.preloadFile = exports.jetAppDir.path("preload/index.js");
const jetDataDir = (0, data_1.GetDataDir)();
exports.jetConfigDir = jetDataDir.GetConfigDir();
exports.jetTmpDir = jetDataDir.GetTmpDir();
exports.COMMON_DIR = {
    ASSET: exports.jetAssetDir.path(""),
    TMP: exports.jetTmpDir.path(""),
    VIEW: exports.jetViewDir.path("")
};
exports.packageJson = exports.jetAppDir.read("package.json", "json");
//# sourceMappingURL=index.js.map