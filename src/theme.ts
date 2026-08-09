import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import "@fontsource-variable/noto-serif-thai/wght.css";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5b6641",
      dark: "#3f482e",
      contrastText: "#fffaf0",
    },
    secondary: {
      main: "#95543f",
      dark: "#66392d",
    },
    warning: {
      main: "#b88f4f",
    },
    background: {
      default: "#c7bdad",
      paper: "#f6f0e4",
    },
    text: {
      primary: "#2f352e",
      secondary: "#5f6257",
    },
    divider: "#b6ad9b",
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: '"Noto Serif Thai variable", system-ui, sans-serif',
    h2: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
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
      styleOverrides: (theme) => ({
        ":root": {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
          fontSynthesis: "none",
        },
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.text.secondary} transparent`,
        },
        "html, body, #app": {
          minHeight: "100%",
        },
        body: {
          margin: 0,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
          backgroundImage: `radial-gradient(${theme.alpha(theme.palette.text.secondary, 0.55)} ${theme.spacing(0.08125)}, transparent ${theme.spacing(0.08125)})`,
          backgroundSize: theme.spacing(1),
        },
      }),
    },
  },
});
theme = responsiveFontSizes(theme);

export { theme };
