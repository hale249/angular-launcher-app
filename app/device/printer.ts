import { Subscribe$, Publish, jetAssetDir, jetTmpDir, Executable } from '../shared';
import { first } from 'rxjs/operators';

/************************************** */
const PRINTER_PROG = jetAssetDir.path("window/printer/Printer.exe");
const TICKET_FOLDER = jetTmpDir.path("ticket");
const printer = new Executable(PRINTER_PROG, []);
const restartPrinter = 30 * 60 * 1000;

printer.online$.pipe(first()).subscribe(_ => {
    printer.message$.subscribe(m => {
        Publish("/kiosk/printer/message", m);
    });
    setInterval(_ => {
        printer.Restart();
    }, restartPrinter);
});

interface IPrinterConfig {
    port: string;
    hide_error: boolean;
}

Subscribe$<IPrinterConfig | string>("/kiosk/printer/start_backup", printer_config => {
    let port = "USB001";
    let hide_error = false;
    if (typeof printer_config === 'object') {
        port = printer_config.port;
        hide_error = printer_config.hide_error;
    } else {
        port = printer_config;
    }
    const args = [port, TICKET_FOLDER];
    if (hide_error) {
        args.push("--no-status");
    }
    printer.ChangeArgsAndStart(args);
});

import { app } from 'electron';
app.on("quit", () => {
    printer.Terminate();
});
