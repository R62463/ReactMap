import create from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(persist(set => ({
  location: undefined,
  setLocation: (location) => set({ location }),
  zoom: undefined,
  setZoom: (zoom) => set({ zoom }),
  filters: undefined,
  setFilters: (filters) => set({ filters }),
  settings: undefined,
  setSettings: (settings) => set({ settings }),
  userSettings: undefined,
  setUserSettings: (userSettings) => set({ userSettings }),
  icons: undefined,
  setIcons: (icons) => set({ icons }),
  menus: undefined,
  setMenus: (menus) => set({ menus }),
  tutorial: true,
  setTutorial: (tutorial) => set({ tutorial }),
  sidebar: undefined,
  setSidebar: (sidebar) => set({ sidebar }),
  advMenu: {
    pokemon: 'others',
    gyms: 'categories',
    pokestops: 'categories',
    nests: 'others',
  },
  setAdvMenu: (advMenu) => set({ advMenu }),
  search: '',
  setSearch: (search) => set({ search }),
  searchTab: 0,
  setSearchTab: (searchTab) => set({ searchTab }),
  popups: {
    invasions: false,
    extras: false,
    pvp: false,
    names: true,
  },
  setPopups: (popups) => set({ popups }),
  motdIndex: 0,
  setMotdIndex: (motdIndex) => set({ motdIndex }),
}),
{
  name: 'local-state',
  getStorage: () => localStorage,
}))

const useStatic = create(set => ({
  auth: { discord: true, loggedIn: false, perms: {} },
  setAuth: (auth) => set({ auth }),
  config: undefined,
  setConfig: (config) => set({ config }),
  filters: undefined,
  setFilters: (filters) => set({ filters }),
  menus: undefined,
  setMenus: (menus) => set({ menus }),
  menuFilters: undefined,
  setMenuFilters: (menuFilters) => set({ menuFilters }),
  userSettings: undefined,
  setUserSettings: (userSettings) => set({ userSettings }),
  settings: undefined,
  setSettings: (settings) => set({ settings }),
  available: undefined,
  setAvailable: (available) => set({ available }),
  Icons: undefined,
  setIcons: (Icons) => set({ Icons }),
  ui: {},
  setUi: (ui) => set({ ui }),
  masterfile: {},
  setMasterfile: (masterfile) => set({ masterfile }),
  hideList: [],
  setHideList: (hideList) => set({ hideList }),
  excludeList: [],
  setExcludeList: (excludeList) => set({ excludeList }),
  timerList: [],
  setTimerList: (timerList) => set({ timerList }),
}))

export { useStore, useStatic }
