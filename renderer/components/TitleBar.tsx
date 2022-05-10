import electron from 'electron'
import { useEffect, useState } from 'react'
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
} from 'react-icons/vsc'

export default function TitleBar() {
  const ipcRenderer = electron.ipcRenderer
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    ipcRenderer?.on('window-maximized', () => {
      setMaximized(true)
    })
    ipcRenderer?.on('window-unmaximized', () => {
      setMaximized(false)
    })

    return () => {
      ipcRenderer?.removeAllListeners('window-maximized')
      ipcRenderer?.removeAllListeners('window-unmaximized')
    }
  }, [])

  function handleMinimize() {
    ipcRenderer?.send('app-minimize')
  }

  function handleMaximize() {
    ipcRenderer?.send('app-maximize')
  }

  function handleClose() {
    ipcRenderer?.send('app-close')
  }

  return (
    <div className="titlebar app-drag">
      <div className="controls flex justify-between">
        {/* <div className="menu app-no-drag">File Open</div> */}
        <div className="title">Typesensor</div>
        <ul className="app-no-drag flex justify-end">
          <div className="icon" onClick={handleMinimize}>
            <VscChromeMinimize />
          </div>
          <div className="icon" onClick={handleMaximize}>
            {maximized ? <VscChromeRestore /> : <VscChromeMaximize />}
          </div>
          <div className="icon close" onClick={handleClose}>
            <VscChromeClose />
          </div>
        </ul>
      </div>
    </div>
  )
}
