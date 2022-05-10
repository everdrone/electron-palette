import electron from 'electron'
import { useState, useEffect, useRef, Fragment } from 'react'
import useToggle from '@utils/useToggle'
import cn from 'clsx'
import * as VSC from 'react-icons/vsc'
import { useRouter } from 'next/router'

import Fuse from 'fuse.js'
import { Dialog, Combobox } from '@headlessui/react'

export default function CommandPalette() {
  const ipcRenderer = electron.ipcRenderer
  const router = useRouter()
  const [palette, togglePalette, setPalette] = useToggle(false)
  // const [selectedPerson, setSelectedPerson] = useState(null)
  const [query, setQuery] = useState('')

  // const filteredItems =
  //   query === ''
  //     ? items
  //     : new Fuse(items, {
  //         includeScore: true,
  //         includeMatches: true,
  //         isCaseSensitive: false,
  //       }).search(query)

  const [filteredItems, setFilteredItems] = useState([])

  const paletteSearchRef = useRef()

  const items = [
    {
      name: 'Search',
      icon: 'VscSearch',
      search: 'document,find,collection,query',
    },
    {
      name: 'Edit Schema',
      icon: 'VscBracketDot',
      search: 'schema,collection,database,fields,collection,json,edit',
    },
    {
      name: 'Connection Status',
      icon: 'VscDebugDisconnect',
      search: 'connection,status,system,cpu',
    },
    {
      name: 'Curations',
      icon: 'VscCombine',
      search: 'curation,promotion',
    },
    {
      name: 'Export Data',
      icon: 'VscDebugStepOut',
      search: 'export,data,save,download,zip',
    },
    {
      name: 'Import Data',
      icon: 'VscDebugStepInto',
      search: 'import,data,load,upload,open,zip',
    },
    {
      name: 'Settings',
      icon: 'VscGear',
      search: 'connection,settings,configuration,theme',
      action: () => {
        router.push('/connection')
      },
    },
    {
      name: 'Developer Tools',
      icon: 'VscDebugConsole',
      search: 'developer,tools,debug,console',
    },
  ]

  useEffect(() => {
    if (query === '') {
      setFilteredItems(items)
    } else {
      const fuse = new Fuse(items, {
        includeScore: true,
        isCaseSensitive: false,
        threshold: 0.3,
        keys: [
          {
            name: 'name',
            weight: 1,
          },
          {
            name: 'search',
            weight: 1,
          },
        ],
      })

      const result = fuse.search(query)
      console.log(result)

      setFilteredItems(result.map(result => result.item))
    }
  }, [query])

  useEffect(() => {
    console.log('registering shortcut listener')
    ipcRenderer?.on('shortcut-pressed', async (event, shortcut) => {
      console.log('shortcut', shortcut)
      if (shortcut === 'ctrl+k') {
        togglePalette()
        // console.log(await ipcRenderer?.invoke('store-get-value'))
      }
    })

    return () => {
      ipcRenderer?.removeAllListeners('shortcut-pressed')
    }
  }, [])

  return (
    <Dialog
      open={palette}
      initialFocus={paletteSearchRef}
      onClose={() => setPalette(false)}
      className="dialog-container items-center justify-center"
    >
      <Dialog.Overlay className="overlay inset-0 bg-black opacity-30" />
      <div className="palette bg-alternate-500 text-primary-100 rounded-xl shadow-xl max-w-sm mx-auto overflow-hidden">
        <Combobox
          onChange={async newValue => {
            setPalette(false)
            if (newValue.action) {
              newValue.action()
            } else {
              alert('implement me!')
            }
            // await ipcRenderer.invoke('store-set-value', 'foo', newValue)
          }}
        >
          <Combobox.Input
            onChange={event => setQuery(event.target.value)}
            displayValue={person => (person ? person.name : '')}
            placeholder="Search..."
            className="search-input"
          />
          <Combobox.Options>
            {filteredItems.map(person => (
              <Combobox.Option key={person.id} value={person} as={Fragment}>
                {({ active, selected }) => {
                  const Icon = person.icon ? VSC[person.icon] : null
                  return (
                    <li className={cn('option', active && 'active')}>
                      <div className="inner flex items-center">
                        {person.icon && (
                          <div className="icon">
                            <Icon />
                          </div>
                        )}
                        {person.name}
                      </div>
                    </li>
                  )
                }}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
    </Dialog>
  )
}
