"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppLink = void 0;
const shared_1 = require("../shared");
const view = shared_1.jetViewDir.path("connecting/index.html");
const links = {
    kiosk: '/device/#/kiosk',
};
function wrapLocalConnecting(url) {
    return `file://${view}?url=${encodeURIComponent(url)}`;
}
function GetAppLink(app) {
    const url = `${app.link}${links.kiosk}`;
    if (app.no_loading) {
        return url;
    }
    if (url.startsWith("file")) {
        return url;
    }
    return wrapLocalConnecting(url);
}
exports.GetAppLink = GetAppLink;
//# sourceMappingURL=category.js.map