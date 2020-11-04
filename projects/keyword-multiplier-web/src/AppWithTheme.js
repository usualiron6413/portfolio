import { App } from './App'
import { ThemeProvider } from '@material-ui/core/styles'
import { createElement } from 'react'
import { theme } from '@cjo3/shared/react/themes/keyword-multiplier'

export const AppWithTheme = createElement(
  ThemeProvider,
  { theme },
  createElement(App)
)
