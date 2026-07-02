const { app, BrowserWindow } = require("electron");
const RPC = require("discord-rpc");
const path = require("path"); // 

process.on("unhandledRejection", console.error);

// ---------- FFmpeg Setup ----------
function getFFmpegPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "ffmpeg-static", "ffmpeg.exe");
  }
  const ffmpegPath = require("ffmpeg-static");
  return ffmpegPath;
}

process.env.FFMPEG_PATH = getFFmpegPath();
console.log("FFmpeg path:", process.env.FFMPEG_PATH);

// ---------- Discord RPC ----------
const clientId = "1371078421697794118";
RPC.register(clientId);

let rpc;
function startRPC() {
  rpc = new RPC.Client({ transport: "ipc" });

  rpc.on("ready", async () => {
    console.log("RTM RPC connected");

    try {
      await rpc.setActivity({
        details: "Learning and Blundering",
        startTimestamp: new Date(),
        largeImageKey: "logo",
        largeImageText: "logo",
        buttons: [
          {
            label: "Secret",
            url: "https://github.com/rawmid"
          }
        ]
      });
      console.log("Activity updated");
    } catch (err) {
      console.error("RPC activity failed:", err);
    }
  });

  rpc.login({ clientId }).catch(console.error);
}

// ---------- Electron Window ----------
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 460,
    height: 240,
    resizable: false,
    frame: false,
    transparent: true,
    roundedCorners: true,
    backgroundColor: "#00000000",
    show: false,
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: { nodeIntegration: true }
  });

  win.loadFile(path.join(__dirname, "index.html"));

  win.once("ready-to-show", () => win.show());

  win.on("closed", () => app.quit());
}

// ---------- App Ready ----------
app.whenReady().then(() => {
  startRPC();
  createWindow();
});

app.on("window-all-closed", () => app.quit());