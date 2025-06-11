import { contextBridge, ipcRenderer } from 'electron'

const api = {
  resizeWindow: (width, height) => ipcRenderer.send('resize-window', { width, height }),
  closeApp: () => ipcRenderer.send('close-app'),
  updateOpacity: (newOpacity) => ipcRenderer.send('update-opacity', newOpacity),
  onSetOpacity: (callback) => ipcRenderer.on('set-opacity', (_event, value) => callback(value))
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
}
