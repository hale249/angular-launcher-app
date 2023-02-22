
export interface IUpdate {
  url: string;
  auto_install: boolean;
  auto_check: boolean;
  check_minute: number;
}

export interface IAdminConfig {
  password: IUpdate;
  update: IUpdate;
}

export interface IAppRuntime {
  link: string;
}

export interface IAppConfig {
  id: string;
  name: string;
  link: string;
  debug?: boolean;
  fullscreen?: boolean;
  primary?: boolean;
  autostart?: boolean;
  screen_id?: string;
  runtime?: IAppRuntime;
}
