import { XBrowserWindow, Subscribe$, Publish, jetViewDir, preloadFile } from '../shared';
/******************************************* */
const TICKET_BROWSER_CONFIG: Electron.BrowserWindowConstructorOptions = {
    width: 800,
    height: 500,
    show: false,
    closable: false,
    webPreferences: {
        nodeIntegration: false,
        preload: preloadFile
    }
};

const TICKET_VIEW = jetViewDir.path("ticket/ticket.html");
const TICKET_CONFIG = {
    id: "ticket",
    name: "ticket",
    link: TICKET_VIEW,
    no_runtime: true
}

class TicketWindow extends XBrowserWindow {
    protected ScreenOn(s: Electron.Display) {
    }
}

let ticketWindow: TicketWindow;

Subscribe$("/kiosk/ticket/start", _ => {
    if (ticketWindow) {
        return;
    }

    ticketWindow = new TicketWindow(TICKET_CONFIG, TICKET_BROWSER_CONFIG);

    Subscribe$("/kiosk/ticket/debug", _ => {
        if (ticketWindow) {
            ticketWindow.Dev();
        }
    });

    interface ITicketCommand {
        uri: string;
        data: any;
    }

    Subscribe$<ITicketCommand>("/kiosk/ticket/command", arg => {
        if (ticketWindow) {
            ticketWindow.Send("command", arg);
        }
    });
});
