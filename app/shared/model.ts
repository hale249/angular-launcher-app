export interface IAppRuntime {
  [index: string]: string;
}

export interface IAppConfig {
  id: string;
  name: string;
  link: string;
  debug?: boolean;
  fullscreen?: boolean;
  primary?: boolean;
  autostart?: boolean;
  no_loading?: boolean;
  no_runtime?: boolean;
}
