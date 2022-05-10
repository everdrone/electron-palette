import electron from 'electron'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import TitleBar from '@components/TitleBar'
import CommandPalette from '@components/CommandPalette'
import * as VSC from 'react-icons/vsc'

export default function Connection() {
  const ipcRenderer = electron.ipcRenderer
  const [nodes, setNodes] = useState([])
  const [apiKey, setApiKey] = useState('')

  const [theme, setTheme] = useState({})

  useEffect(async () => {
    const connection = await ipcRenderer?.invoke(
      'store-get-value',
      'connection'
    )
    const theme = await ipcRenderer?.invoke('store-get-value', 'theme')

    setNodes(connection?.nodes || ['http://localhost:8108'])
    setApiKey(connection?.apiKey || '')
    setTheme(theme || {})
  }, [])

  const router = useRouter()

  return (
    <>
      <TitleBar />
      <div id="main-content">
        <div className="h-full w-full flex flex-col justify-start items-center">
          <div
            className="flex flex-col"
            style={{
              width: 'clamp(400px, 75%, 600px)',
              marginTop: '10vh',
            }}
          >
            <h1 className="font-semibold text-2xl mb-3 text-primary-400">
              Settings
            </h1>
            <main className="flex flex-col rounded-xl shadow-xl overflow-hidden bg-primary-500 border border-primary-700">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="API Key"
                className="w-full font-cascadia"
              />
              <input
                type="text"
                placeholder="Node 0 URI"
                className="w-full font-cascadia"
                value={nodes[0]}
                onChange={event => {
                  const newNodes = [...nodes]
                  newNodes[0] = event.target.value
                  setNodes(newNodes)
                }}
              />
              {nodes.map((node, index) => {
                if (index > 0) {
                  return (
                    <div className="flex" key={index}>
                      <input
                        type="text"
                        placeholder={`Node ${index} URI`}
                        className="w-full font-cascadia"
                        value={nodes[index]}
                        onChange={event => {
                          const newNodes = [...nodes]
                          newNodes[index] = event.target.value
                          setNodes(newNodes)
                        }}
                      />
                      <button
                        className="codicon-button danger"
                        onClick={() => {
                          setNodes(nodes.filter((_, i) => i !== index))
                        }}
                      >
                        <div className="inner">
                          <VSC.VscTrash />
                        </div>
                      </button>
                    </div>
                  )
                }
                return null
              })}
              <div
                className="codicon-button"
                onClick={() => setNodes([...nodes, 'http://localhost:8108'])}
              >
                <div className="inner flex items-center">
                  <VSC.VscDiffAdded /> <p>Add Node</p>
                </div>
              </div>
            </main>
            <h1 className="font-semibold text-2xl mb-3 mt-4 text-primary-400">
              Theme
            </h1>
            <main className="flex flex-col rounded-xl shadow-xl overflow-hidden bg-primary-500 border border-primary-700">
              <input
                type="text"
                value={theme.accent}
                onChange={e => setTheme({ ...theme, accent: e.target.value })}
                placeholder="accent"
                className="w-full font-cascadia"
              />
            </main>
            <div className="flex justify-end gap-3 w-full mt-4">
              <button
                className="push-button"
                onClick={async () => {
                  await ipcRenderer?.invoke('store-set-all', {
                    connection: {
                      nodes,
                      apiKey,
                    },
                    theme,
                  })
                  await ipcRenderer?.send('settings-saved')
                  router.push('/')
                }}
              >
                Save
              </button>
              <button
                className="push-button danger"
                onClick={() => {
                  router.push('/')
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <CommandPalette />
      </div>
    </>
  )
}
