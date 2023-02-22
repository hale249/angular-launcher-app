import { Injectable } from '@angular/core';

class QmsService {
  __x: any;
  require: any;
  listen: any;
  version: string;
}

@Injectable()
export class NativeService {
  constructor() {

  }

  qms: QmsService = window['__QMS'] || new QmsService();
  electron = this.qms.require('electron');
  version = this.qms.version;
  listen<T>(event: string, cb: (data: T) => void) {
    this.qms.listen(event, cb);
  }
}
