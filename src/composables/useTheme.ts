import { InjectionKey, inject, Ref, provide, readonly } from 'vue'

export type Theme = 'light' | 'dark' | 'classic'
export type ThemeRef = Ref<Theme>

export const ThemeSymbol: InjectionKey<ThemeRef> = Symbol()

export const provideTheme = (theme: ThemeRef) => {
  provide(ThemeSymbol, theme)
}

export const useTheme = () => {
  const t = inject(ThemeSymbol)
  if (!t) {
    throw new Error('useTheme() is called without provider.')
  }

  const theme = readonly(t)
  const setTheme = (theme: Theme) => (t.value = theme)
  return { theme, setTheme }
}