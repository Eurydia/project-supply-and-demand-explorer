import { Outlet, createRootRoute } from '@tanstack/react-router';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#245f9e',
      dark: '#18456f',
      contrastText: '#fffdf5',
    },
    secondary: {
      main: '#d84f4f',
    },
    background: {
      default: '#e9e3d4',
      paper: '#fffdf5',
    },
    text: {
      primary: '#27364a',
      secondary: '#667085',
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: '"Noto Sans Thai", system-ui, sans-serif',
    h2: {
      fontFamily: '"Mali", "Noto Sans Thai", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Mali", "Noto Sans Thai", sans-serif',
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          boxShadow: 'none',
          paddingInline: 16,
        },
        contained: {
          border: '2px solid #18456f',
          boxShadow: '3px 3px 0 #18456f',
          '&:hover': {
            boxShadow: '1px 1px 0 #18456f',
            transform: 'translate(2px, 2px)',
          },
        },
      },
    },
  },
});

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  ),
});
