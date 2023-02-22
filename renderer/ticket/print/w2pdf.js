
const ticketFolder = __QMS.tmp.dir("ticket");
const tmpTicketFolder = __QMS.os_tmp.dir("ticket");
const electron = require('electron');
const webContents = electron.remote.getCurrentWebContents();
const fs = require('fs');

const MARGIN = {
    DEFAULT: 0,
    NO: 1,
    MINIMUM: 2
}

const PrintOptions = {
    marginsType: MARGIN.NO,
    printBackground: false,
}

function PrintToFile(file, cb) {
    webContents.printToPDF(PrintOptions, (error, data) => {
        if (error) {
            fs.unlink(file);
            cb(error);
            return;
        }
        fs.writeFile(file, data, cb);
    });
}


function PrintMe(args, cb) {
    const { cnum, id } = args;
    const name = `${cnum}-${id}-${Date.now()}.pdf`;
    const tmpFile = tmpTicketFolder.path(name);
    const file = ticketFolder.path(name);
    PrintToFile(tmpFile, (err) => {
        if (err) {
            cb(err);
            return;
        }
        console.log(`move ${tmpFile} to ${file}`);
        tmpTicketFolder.move(tmpFile, file);
    });
}

module.exports = {
    PrintMe,
}
