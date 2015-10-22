var   app = require('app'),
      ipc = require('ipc'),
      crashReporter = require('crash-reporter'),
      BrowserWindow = require('browser-window');

crashReporter.start({
  productName: 'es6-ng-electron',
  companyName: 'CourseWork Inc.',
  submitUrl: 'http://localhost:3000/',
  autoSubmit: true
});

var mainWindow = null;

ipc.on('crash', function (event, arg) {
   console.log("ipc | crash");
   process.crash(arg);
});

ipc.on('devTools', functino (event,arg) {
   console.log("ipc | devTools");
   mainWindow.openDevTools();
   //mainWindow.closeDevTools();
});

app.on('window-all-closed', function() {
    // force app termination on OSX when mainWindow has been closed
    if (process.platform == 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    //mainWindow.setMenu(null);
    mainWindow.loadUrl('file://' + __dirname + '/../browser/index.html');
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.setTitle(app.getName());
    });
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
