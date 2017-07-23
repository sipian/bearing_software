const electron = require("electron"),
      path = require("path"),
      app = electron.app,
      BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 700,
    height: 700,
    icon: path.join(__dirname, 'app/public/images/logo.png')
  });
  mainWindow.focus();
  mainWindow.maximize();
  mainWindow.loadURL(`file://${__dirname}/index.html`)
 // mainWindow.webContents.openDevTools();
  mainWindow.on("closed", function () {
    mainWindow = null;
  })
}

app.on("ready", createWindow);
app.on("browser-window-created",function(e,window) {
  window.setMenu(null);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});