const electron = require('electron');
const webContents = electron.remote.getCurrentWebContents();

const StatusPrinterNotFound = -1;

const PRINTER_STATUS_OK = 0
const PRINTER_STATUS_PAUSED = 1
const PRINTER_STATUS_ERROR = 2
const PRINTER_STATUS_PENDING_DELETION = 4
const PRINTER_STATUS_PAPER_JAM = 8
const PRINTER_STATUS_PAPER_OUT = 16
const PRINTER_STATUS_MANUAL_FEED = 32
const PRINTER_STATUS_PAPER_PROBLEM = 64
const PRINTER_STATUS_OFFLINE = 128
const PRINTER_STATUS_IO_ACTIVE = 256
const PRINTER_STATUS_BUSY = 512
const PRINTER_STATUS_PRINTING = 1024
const PRINTER_STATUS_OUTPUT_BIN_FULL = 2048
const PRINTER_STATUS_NOT_AVAILABLE = 4096
const PRINTER_STATUS_WAITING = 8192
const PRINTER_STATUS_PROCESSING = 16384
const PRINTER_STATUS_INITIALIZING = 32768
const PRINTER_STATUS_WARMING_UP = 65536
const PRINTER_STATUS_TONER_LOW = 131072
const PRINTER_STATUS_NO_TONER = 262144
const PRINTER_STATUS_PAGE_PUNT = 524288
const PRINTER_STATUS_USER_INTERVENTION = 1048576
const PRINTER_STATUS_OUT_OF_MEMORY = 2097152
const PRINTER_STATUS_DOOR_OPEN = 4194304
const PRINTER_STATUS_SERVER_UNKNOWN = 8388608
const PRINTER_STATUS_POWER_SAVE = 16777216

// https://msdn.microsoft.com/en-us/library/cc244854.aspx
const StatusCodes = {
    [PRINTER_STATUS_OK]: 'normal',
    [PRINTER_STATUS_PAUSED]: 'warn_printer_paused',
    [PRINTER_STATUS_ERROR]: 'err_printer_error',
    [PRINTER_STATUS_PENDING_DELETION]: 'err_pending_deletion',
    [PRINTER_STATUS_PAPER_JAM]: 'err_paper_jam',
    [PRINTER_STATUS_PAPER_OUT]: 'err_paper_end',
    [PRINTER_STATUS_MANUAL_FEED]: 'warn_printer_manual_feed', // The printer is in a manual feed state.
    [PRINTER_STATUS_PAPER_PROBLEM]: 'err_paper_problem',
    [PRINTER_STATUS_OFFLINE]: 'err_printer_offline',
    [PRINTER_STATUS_IO_ACTIVE]: 'normal',
    [PRINTER_STATUS_BUSY]: 'warn_printer_busy', // The printer is busy.
    [PRINTER_STATUS_PRINTING]: 'normal',
    [PRINTER_STATUS_OUTPUT_BIN_FULL]: 'warn_output_bin_full',
    [PRINTER_STATUS_NOT_AVAILABLE]: 'err_not_available',
    [PRINTER_STATUS_WAITING]: 'normal',
    [PRINTER_STATUS_PROCESSING]: 'normal',
    [PRINTER_STATUS_INITIALIZING]: 'normal',
    [PRINTER_STATUS_WARMING_UP]: 'normal',
    [PRINTER_STATUS_TONER_LOW]: 'warn_paper_near_end', // paper near end
    [PRINTER_STATUS_NO_TONER]: 'err_paper_end', // The printer is out of toner.
    [PRINTER_STATUS_PAGE_PUNT]: 'warn_current_page_print_fail', // The printer cannot print the current page.
    [PRINTER_STATUS_USER_INTERVENTION]: 'err_printer_require_user_intervention', 
    [PRINTER_STATUS_OUT_OF_MEMORY]: 'err_out_of_memory',
    [PRINTER_STATUS_DOOR_OPEN]: 'err_head_opened',
    [PRINTER_STATUS_SERVER_UNKNOWN]: 'err_printer_server',
    [PRINTER_STATUS_POWER_SAVE]: 'warn_power_save',
    [StatusPrinterNotFound]: 'err_disconnected',
}

const internals = {
    status: PRINTER_STATUS_OFFLINE,
    last_print_ok: true,
};

const StatusCheckInterval = 10000;

/********************************************************** */
function PrintMe() {
    webContents.print({ silent: true }, success => {
        internals.last_print_ok = success;
        if (success) {
            //
        } else {
            new Notification('Print ticket fail');
            checkStatus();
        }
    });
}

module.exports = {
    PrintMe,
};

/****************************************************/

function checkStatus() {
    const prev_status = internals.status;
    const printer = webContents.getPrinters().find(f => f.isDefault);
    const status = printer ? printer.status : StatusPrinterNotFound;
    const printer_name = printer ? printer.name : '';
    internals.status = status;
    const code = StatusCodes[status] || 'err_unknown';
    __QMS.__x.Broadcast("/kiosk/printer/message", {
        uri: '/status',
        data: JSON.stringify({ code })
    });
    if (status != prev_status) {
        if (status === PRINTER_STATUS_OK) {
            new Notification(`Kiosk: Printer ready`, {
                body: `Printer: ${printer_name}\n`
            });
        } else if (status === PRINTER_STATUS_TONER_LOW) {
            new Notification('Kiosk: Printer warning', {
                body: `Printer: ${printer_name}\n paper near end`,
            });
        } else if (status === StatusPrinterNotFound) {
            new Notification('Kiosk: Printer not found');
        } else {
            new Notification('Kiosk: Printer issue', {
                body: `Printer: ${printer_name}\nStatus: ${code}\nCode: ${status}`
            });
        }
    }
}

setInterval(() => {
    checkStatus();
}, StatusCheckInterval);

