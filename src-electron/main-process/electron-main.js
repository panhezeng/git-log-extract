import { app, BrowserWindow, nativeTheme } from "electron";
const child_process = require("child_process");

const exec = child_process.exec;

function requireContext(context) {
  return context.keys().map((path) => {
    return { module: context(path), path };
  });
}

try {
  if (
    process.platform === "win32" &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    require("fs").unlinkSync(
      require("path").join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname;
}

let mainWindow;
// let childWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1160,
    height: 700,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
      enableRemoteModule: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // 自动加载 module 目录下非 *exclude.js命名规则的 js 文件，并执行 export default function , 传入参数 mainWindow
  // 所有需要在主进程执行的功能代码，都可以放到 module 目录下，会自动执行，代码分离解耦
  requireContext(
    require.context("./module/", true, /(?<!exclude)\.js$/)
  ).forEach(({ module }) => {
    if (module && typeof module.default === "function") {
      module.default(mainWindow);
    }
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("will-quit", () => {
  mainWindow.webContents.send("quit");
  exec("xl_close_port -p 8081", (error, stdout, stderr) => {
    if (error) {
      console.log(error.stack);
      console.log("Error code: " + error.code);
      return;
    }
    console.log("使用exec方法输出: " + stdout);
    console.log(`stderr: ${stderr}`);
  });
});

// function openTest() {
//   childWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     parent: mainWindow,
//     webPreferences: {
//       // Change from /quasar.conf.js > electron > nodeIntegration;
//       // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
//       nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
//       nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
//       devTools: true,
//       // More info: /quasar-cli/developing-electron-apps/electron-preload-script
//       // preload: path.resolve(__dirname, 'electron-preload.js')
//     },
//   });
//
//   childWindow.loadURL(process.env.APP_URL + "#/test");
//
//   childWindow.on("close", () => {
//     mainWindow.webContents.send("testClosed");
//   });
//
//   childWindow.on("closed", () => {
//     childWindow = null;
//   });
// }
//
// ipcMain.on("openTest", () => openTest());
// ipcMain.on("closeTest", () => {
//   childWindow.close();
// });
