import * as adapter from 'glass-easel-miniprogram-adapter'

export const renderComponent: (
  path: string | undefined,
  template: string,
  f: (
    Component: adapter.ComponentConstructor,
    env: { Behavior: adapter.BehaviorConstructor },
  ) => void,
) => adapter.glassEasel.GeneralComponent

export const defineComponent: (
  path: string | undefined,
  template: string,
  f: (
    Component: adapter.ComponentConstructor,
    env: { Behavior: adapter.BehaviorConstructor },
  ) => void,
) => adapter.glassEasel.GeneralComponent
