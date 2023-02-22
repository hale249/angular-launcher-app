const divMain = document.getElementById("main");
const ticketFormat = __QMS.require_view("./ticket/template/ticket_format");
const { PrintMe } = require('./jsprint');

function Print(args) {
    divMain.innerHTML = ticketFormat(args);
    PrintMe();
}

module.exports = Print;