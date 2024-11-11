const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("system", {
  reboot: () => ipcRenderer.send("reboot"),
});
