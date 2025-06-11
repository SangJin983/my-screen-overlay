import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, shell, Tray } from 'electron'
import Store from 'electron-store'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { debounce } from './utils.js'

const store = new Store({
  defaults: {
    windowBounds: { width: 800, height: 600 },
    opacity: 0.5
  }
})

let mainWindow
let tray
let isQuitting = false

function createWindow() {
  // 저장된 값 불러오기
  const { width, height, x, y } = store.get('windowBounds')

  // 브라우저 창 생성
  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    show: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    transparent: true,
    frame: false,
    minWidth: 100,
    minHeight: 100,
    skipTaskbar: true,
    resizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // --- 창 크기/위치 변경 시 저장하는 로직 ---
  const saveBounds = () => {
    store.set('windowBounds', mainWindow.getBounds())
  }
  const debouncedSaveBounds = debounce(saveBounds, 500)
  mainWindow.on('resize', debouncedSaveBounds)
  mainWindow.on('move', debouncedSaveBounds)
  // ------------------------------------

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.webContents.send('set-opacity', store.get('opacity'))
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 개발 환경에서는 HMR을 사용하고, 프로덕션에서는 빌드된 파일을 로드합니다.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 모든 창이 닫혔을 때 앱이 종료되는 기본 동작을 막습니다.
// 이제 앱은 트레이 아이콘 메뉴에서 '종료'를 눌러야만 종료됩니다.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.whenReady().then(() => {
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('resize-window', (event, { width, height }) => {
    if (mainWindow) {
      // 창크기를 조절할 때만 reszie를 활성화
      mainWindow.setResizable(true)
      mainWindow.setSize(Math.round(width), Math.round(height))
      mainWindow.setResizable(false)
    }
  })

  // 닫기 버튼 요청 처리
  ipcMain.on('close-app', () => {
    mainWindow?.close()
  })

  // 투명도 값 업데이트 및 저장 요청 처리
  ipcMain.on('update-opacity', (event, newOpacity) => {
    store.set('opacity', newOpacity)
  })

  createWindow()

  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '보이기/숨기기',
      click: () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
      }
    },
    { type: 'separator' },
    {
      label: '종료',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('Screen Overlay App')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  const ret = globalShortcut.register('CommandOrControl+Shift+H', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  if (!ret) {
    console.log('단축키 등록에 실패했습니다.')
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
