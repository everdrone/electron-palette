import { IContext } from 'overmind'
import { createStateHook, createActionsHook } from 'overmind-react'
import { createOvermind } from 'overmind'

const config = {
  state: {
    commandPalette: {
      visible: false,
    },
  },
  actions: {
    setCommandPaletteVisibility: ({ state }, value: boolean) => {
      state.commandPalette.visible = value
    },
  },
}

export type Context = IContext<typeof config>

export const useAppState = createStateHook<Context>()
export const useActions = createActionsHook<Context>()

export const overmind = createOvermind(config)
