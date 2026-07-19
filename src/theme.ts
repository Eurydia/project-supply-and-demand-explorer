import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import '@fontsource/mali/500.css';
import '@fontsource/mali/600.css';
import '@fontsource/mali/700.css';
import '@fontsource/noto-sans-thai/200.css';
import '@fontsource/noto-sans-thai/300.css';
import '@fontsource/noto-sans-thai/400.css';
import '@fontsource/noto-sans-thai/500.css';
import '@fontsource/noto-sans-thai/600.css';
import '@fontsource/noto-sans-thai/700.css';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5b6641',
      dark: '#3f482e',
      contrastText: '#fffaf0',
    },
    secondary: {
      main: '#95543f',
      dark: '#66392d',
    },
    warning: {
      main: '#b88f4f',
    },
    background: {
      default: '#c7bdad',
      paper: '#f6f0e4',
    },
    text: {
      primary: '#2f352e',
      secondary: '#5f6257',
    },
    divider: '#b6ad9b',
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
    MuiStack: {
      defaultProps: { useFlexGap: true },
    },
    MuiButtonBase: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          color: '#2f352e',
          backgroundColor: '#c7bdad',
          fontSynthesis: 'none',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#8d927d transparent',
        },
        'html, body, #app': {
          minHeight: '100%',
        },
        body: {
          margin: 0,
          color: '#2f352e',
          backgroundColor: '#c7bdad',
          backgroundImage:
            'radial-gradient(#8f887b 0.65px, transparent 0.65px)',
          backgroundSize: '8px 8px',
        },
      },
    },
  },
});
theme = responsiveFontSizes(theme);
export { theme };
