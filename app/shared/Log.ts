
export class LogService {

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


export const Log = new LogService;
