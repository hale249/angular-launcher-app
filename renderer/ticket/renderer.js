const print = __QMS.require_view('./ticket/print/print');
const register = __QMS.require_view('./ticket/template/template').Register;
const ipcRenderer = __QMS.require('electron').ipcRenderer;

function NotifyReady() {
    __QMS.__x.Broadcast("/kiosk/ticket/ready")
}

const PRINT_RETRY = 3;

ipcRenderer.on('command', (event, arg) => {
    //console.log("print in ipcRenderer.................", arg);
    const uri = arg.uri;
    const data = arg.data;
    if (!uri) {
        return;
    }
    switch (uri) {
        case "/print-ticket":
            print(data, PRINT_RETRY);
            break;
        case "/set-template":
            register(data);
            break;
        case "/query-ready":
            NotifyReady();
            break;
    }
});


NotifyReady();