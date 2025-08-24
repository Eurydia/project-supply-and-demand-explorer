import { Outlet, createRootRoute } from '@tanstack/react-router'
import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  alpha,
  createTheme,
} from '@mui/material'
import { orange } from '@mui/material/colors'

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'Noto Serif Thai; serif',
  },
  palette: {
    primary: {
      main: alpha(orange['500'], 0.4),
      light: alpha(orange['200'], 0.4),
      dark: alpha(orange['700'], 0.4),
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme: { spacing } }) => ({ padding: spacing(1) }),
      },
      defaultProps: { variant: 'outlined' },
    },
  },
})

const global = (
  <GlobalStyles
    styles={(t) => ({
      '*': {
        scrollbarWidth: 'thin',
      },
      /* base zebra (cells + row headers) */
      '.handsontable .htCore td.row-odd, .handsontable .htCore th.row-odd': {
        backgroundColor: t.palette.primary.light,
      },
      /* keep zebra when the cell is selected/edited */
      '.handsontable .htCore td.current.row-odd, .handsontable .htCore td.area.row-odd':
        {
          backgroundColor: t.palette.primary.light,
        },
      /* editor overlay transparent so zebra shows through */
      '.handsontable .handsontableInput, .handsontable .handsontableInputHolder':
        {
          backgroundColor: 'transparent',
        },
      /* theme alignment */
      '.handsontable .htCore td, .handsontable .htCore th': {
        fontFamily: t.typography.fontFamily,
      },
      '.ht-theme-main': {
        '--ht-cell-selection-background-color': theme.palette.primary.main,
        '--ht-cell-selection-border-color': theme.palette.primary.main,
        '--ht-header-highlighted-background-color': theme.palette.primary.main,
        '--ht-header-active-background-color': theme.palette.primary.main,
        '--ht-header-active-border-color': theme.palette.primary.main,
        '--ht-header-row-highlighted-background-color':
          theme.palette.primary.main,
        '--ht-header-row-active-background-color': theme.palette.primary.main,
      },
    })}
  />
)

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {global}
      <Outlet />
    </ThemeProvider>
  ),
})
