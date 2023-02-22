"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publish = exports.Subscribe$ = exports.Hub$ = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
exports.Hub$ = new rxjs_1.Subject();
function Subscribe$(prefix, cb) {
    return exports.Hub$.pipe((0, operators_1.filter)(d => d.uri.startsWith(prefix))).subscribe(d => cb(d.data));
}
exports.Subscribe$ = Subscribe$;
function Publish(uri, data, source) {
    exports.Hub$.next({ uri, data, source });
}
exports.Publish = Publish;
//# sourceMappingURL=hub.js.map