import electron from 'electron'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

import TitleBar from '@components/TitleBar'
import Logo from '@components/Logo'
import CommandPalette from '@components/CommandPalette'

function Home() {
  const ipcRenderer = electron.ipcRenderer

  // useEffect(() => {
  //   ipcRenderer?.on('shortcut-pressed', (event, shortcut) => {})

  //   return () => {
  //     ipcRenderer?.removeAllListeners('shortcut-pressed')
  //   }
  // }, [])

  return (
    <>
      <TitleBar />
      <div id="main-content">
        {/* <div className="h-full w-full flex justify-center items-center">
          <Link href="/connection">Connection</Link>
          <Logo className="w-40 h-40 text-alternate-600" />
        </div> */}
        <CommandPalette />
      </div>
    </>
  )
}

export default Home
