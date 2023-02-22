import { Subscribe$, Publish, jetAssetDir, Executable } from '../shared';
/************************************** */
const CARD_READER_PROG = jetAssetDir.path("window/card-reader/AccessCardReader.exe");
const CardReader = new Executable(CARD_READER_PROG, []);
import { first } from 'rxjs/operators';

CardReader.online$.pipe(first()).subscribe(() => {
    CardReader.state$.subscribe(state => {
        Publish("/kiosk/card-reader/state", state);
    });

    CardReader.message$.subscribe(message => {
        Publish("/kiosk/card-reader/message", message);
    });
})

Subscribe$("/kiosk/card-reader/start", _ => {
    CardReader.Restart();
});


import { app } from 'electron';
app.on("quit", () => {
    CardReader.Terminate();
});
