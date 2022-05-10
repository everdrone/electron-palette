import { app, ipcMain, globalShortcut } from 'electron'
import serve from 'electron-serve'
import Store from 'electron-store'
import { createWindow } from './helpers'

const isProd: boolean = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    frame: false,
    titleBarStyle: 'hidden',
  })

  if (isProd) {
    await mainWindow.loadURL('app://./index.html')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}`)
    mainWindow.webContents.openDevTools()
  }

  /* register events */
  ipcMain.on('app-close', (event, arg) => {
    mainWindow.close()
  })

  ipcMain.on('app-minimize', (event, arg) => {
    mainWindow.minimize()
  })

  ipcMain.on('app-maximize', (event, arg) => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('settings-saved', (event, key) => {
    mainWindow?.webContents.send('settings-saved')
  })

  /* send events back to renderer */
  mainWindow.on('maximize', () =>
    mainWindow?.webContents.send('window-maximized')
  )

  mainWindow.on('unmaximize', () =>
    mainWindow?.webContents.send('window-unmaximized')
  )

  /* register shortcuts */
  globalShortcut.register('CommandOrControl+K', () => {
    mainWindow?.webContents.send('shortcut-pressed', 'ctrl+k')
  })
})()

app.on('window-all-closed', () => {
  app.quit()
})

const store = new Store({ name: 'settings' })
console.info(store.path)

ipcMain.handle('store-get-value', (event, key) => {
  return store.get(key)
})

ipcMain.handle('store-set-value', (event, key, value) => {
  console.log(key, value)
  return store.set(key, value)
})

ipcMain.handle('store-set-all', (event, value) => {
  console.log('setting all store', value)
  return store.set(value)
})

ipcMain.handle('store-delete-key', (event, key) => {
  return store.delete(key)
})
