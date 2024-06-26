import { createTheme } from "@mui/material/styles";

// TODO black mode + switch button

export const theme = createTheme({
  shadows: Array(25).fill('none'),
  palette: {
    primary: {
      main: "#4361ee",
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
  components: {
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 800,
      lg: 1100,
      xl: 1536,
    },
  },
});