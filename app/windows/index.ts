import { app } from 'electron';
import { AdminWindow } from './admin';
let admin: AdminWindow;

// in case the user double click
let can_restore = false;
setTimeout(_ => can_restore = true, 4000);

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit()
} else {
  // Someone tried to run a second instance, we should focus our window.
  if (admin && can_restore) {
    admin.Restore();
  }
}

app.on('ready', () => {
  admin = new AdminWindow();
});
