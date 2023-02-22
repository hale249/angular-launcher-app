"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.LogService = void 0;
class LogService {
    constructor() { }
    Error(...args) {
        console.error(args);
    }
    Debug(...args) {
        console.log("[DEBUG]", ...args);
    }
    InfoLn(...args) {
        console.info.call(this, args.push("\n"));
    }
}
exports.LogService = LogService;
exports.Log = new LogService;
//# sourceMappingURL=Log.js.map