// preload.js
const electron = require('electron');
const jetpack = require('fs-jetpack');
const os = require('os');

const __x = electron.remote.getCurrentWindow()['__x'];
const version = electron.remote.app.getVersion();

/**
 * @type {{ASSET: string, TMP: string, VIEW: string}}
 */
const DIR = __x.DIR;
const jetViewDir = jetpack.cwd(DIR.VIEW);
const jetTmpDir = jetpack.cwd(DIR.TMP);
const jetOsTmpDir = jetpack.cwd(os.tmpdir());
const jetAssetDir = jetpack.cwd(DIR.ASSET);

function nodeRequire(moduleName) {
  return require(moduleName);
}

function requireView(name) {
  return require(jetViewDir.path(name));
}

function listen(event, cb) {
  if (cb) {
    electron.ipcRenderer.on(event, (e, arg) => {
      cb(arg);
    });
  }
}

function message(event, cb) {
  listen(event, arg => {
    if (arg && arg.uri) {
      cb(arg.uri, arg.data);
    } else {
      cb("/unknown", arg);
    }
  });
}

function run_command(cmd, args) {
  require("child_process").spawn(cmd, args);
}

const util = {
  cmd: run_command,
  eval: eval
}

const __QMS = {
  require: nodeRequire,
  require_view: requireView,
  tmp: jetTmpDir,
  os_tmp: jetOsTmpDir,
  listen: listen,
  message: message,
  version: version,
  __util: util,
  __x: __x
}

process.once('loaded', function() {
  global["__QMS"] = __QMS;
});
