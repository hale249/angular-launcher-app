import { IAppConfig } from './model';
import { jetViewDir } from '../shared';
const view = jetViewDir.path("connecting/index.html");

const links = {
  kiosk: '/device/#/kiosk',
}

function wrapLocalConnecting(url: string) {
  return `file://${view}?url=${encodeURIComponent(url)}`;
}

export function GetAppLink(app: IAppConfig) {
  const url = `${app.link}${links.kiosk}`;
  if (app.no_loading) {
    return url;
  }
  if (url.startsWith("file")) {
    return url;
  }

  return wrapLocalConnecting(url);
}
