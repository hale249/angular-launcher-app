import {
  createServer, Server,
  request, RequestOptions,
  IncomingMessage, ServerResponse
} from 'http';
import { parse } from 'url';

// A simplified http proxy
// Response is saved to file
// Method is just forwarded
export class HttpProxy {
  constructor(private _remote: string) { }
  private remote = parse(this._remote);

  private server: Server;
  private port: number;

  private getFromRemote(req: IncomingMessage) {
    const opt: RequestOptions = {
      hostname: this.remote.hostname,
      port: +this.remote.port || 80,
      protocol: this.remote.protocol,
      method: req.method,
      path: req.url
    }
    return new Promise<IncomingMessage>((resolve) => {
      const reqPromiseData = request(opt, resCallback => {
        resolve(resCallback);
      });
      req.pipe(reqPromiseData, { end: true });
    });
  }

  protected handle(req: IncomingMessage, res: ServerResponse) {
    return this.getFromRemote(req).then(resCallBack => {
      resCallBack.pipe(res, { end: true });
      resCallBack.on('error', e => {
        res.write(e.message);
        res.writeHead(resCallBack.statusCode);
      });
      return resCallBack;
    });
  }

  Listen(port: number) {
    if (this.port == port) {
      return;
    }
    this.port = port;
    this.restart();
  }

  private restart() {
    if (!this.server) {
      this.server = createServer((req, res) => {
        this.handle(req, res).catch(e => {
          res.write(e.toString());
          res.writeHead(501);
        }).catch(e => {
          console.log(e);
          res.write("internal server error");
          res.writeHead(501);
        });
      });
    }
    this.server.listen(this.port);
  }
}
