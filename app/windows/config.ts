import {  IAppConfig, Store } from '../shared';

export interface IGlobalConfig {
  password: string;
  apps: IAppConfig[];
}

function makeAppID() {
  return Math.random().toString(36).substr(3, 9);
}

export class ConfigStore extends Store<IGlobalConfig> {
  constructor() {
    // @ts-ignore
    super();
    this.GetAllApps();
  }

  get Apps() {
    return this.state.apps;
  }

  GetAllApps() {
    this.restore();
    return this.Apps;
  }

  GetApp(id: string) {
    return this.Apps.find(a => a.id === id);
  }

  SaveApp(app: IAppConfig) {
    if (!app) {
      return;
    }
    if (!app.id) {
      app.id = makeAppID();
      this.Apps.push(app);
    } else {
      let index = this.Apps.findIndex(a => a.id === app.id);
      if (index === -1) {
        return;
      }
      this.Apps[index] = app;
    }
    // fix app screen
    this.save();
  }

  DeleteApp(id: string) {
    let index = this.Apps.findIndex(a => a.id === id);
    if (index !== -1) {
      this.Apps.splice(index, 1);
    }
    this.save();
  }

  SavePassword(password: string) {
    this.state.password = password;
    this.save();
  }

  checkPassword(candidate: string) {
    return this.state.password === candidate;
  }
}
