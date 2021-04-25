/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, nativeTheme } from "electron";
import path from "path";
import requireContext from "./utils/require-context";

try {
  if (
    process.platform === "win32" &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    require("fs").unlinkSync(
      require("path").join(app.getPath("userData"), "DevTools Extensions")
    );
  }
  // eslint-disable-next-line no-empty
} catch (_) {}

let mainWindow: BrowserWindow | null | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1160,
    height: 700,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        __dirname,
        process.env.QUASAR_ELECTRON_PRELOAD || ""
      ),
    },
  });

  mainWindow.loadURL(process.env.APP_URL || "");

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      if (mainWindow) mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // 自动加载 module/main 目录下非 *exclude.js命名规则的 js 文件，并执行 export default function , 传入参数 mainWindow
  // 所有需要在主进程执行的功能代码，都可以放到 module/main 目录下，会自动执行，代码分离解耦
  requireContext(
    require.context("./module/main", true, /(?<!exclude)\.ts$/)
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
  if (!mainWindow) {
    createWindow();
  }
});
