import React, { useEffect } from 'react'
import electron from 'electron'
import type { AppProps } from 'next/app'

import NoSSR from 'react-no-ssr'

import '../styles/globals.scss'
import '../styles/window.scss'
import '../styles/controls.scss'

import { Provider } from 'overmind-react'
import { overmind } from '@utils/overmind'

import validateColor from 'validate-color'

function MyApp({ Component, pageProps }: AppProps) {
  const ipcRenderer = electron.ipcRenderer

  async function evaluateSettings() {
    const theme = await ipcRenderer?.invoke('store-get-value', 'theme')
    console.info(theme)
    if (theme && typeof theme === 'object') {
      Object.keys(theme).map(key => {
        if (validateColor(theme[key])) {
          console.log(theme[key])
          document.documentElement.style.setProperty(`--${key}`, theme[key])
        } else {
          document.documentElement.style.removeProperty(`--${key}`)
        }
      })
    }
  }

  useEffect(async () => {
    await evaluateSettings()

    ipcRenderer?.on('settings-saved', async (event, key) => {
      console.log('settings saved', key)
      await evaluateSettings()
    })

    return () => {
      ipcRenderer?.removeAllListeners('settings-saved')
    }
  }, [])

  return (
    <Provider value={overmind}>
      <NoSSR>
        <Component {...pageProps} />
      </NoSSR>
    </Provider>
  )
}

export default MyApp
