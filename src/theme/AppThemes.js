import { createTheme } from "@mui/material/styles";
import shadows from "@mui/material/styles/shadows";

export const violet_theme = createTheme({
  palette: {
    primary: {
      light: "#FE8F8F",
      main: "#DB0A5B",
      dark: "#D70019",
      contrastText: "#FFEDD3",
    },
    secondary: {
      light: "#FE8F8F",
      main: "#DB0A5B",
      dark: "#D70019",
      contrastText: "#FFEDD3",
    },
    custom: {
      light: "#FE8F8F",
      main: "#DB0A5B",
      dark: "#A60013",
      contrastText: "#FFEDD3",
    },
    whiteGray: "#F3F3F3",
    slightlyDarkerWhiteGray: "#EDEDED",
  },
  typography: {
    // fontFamily: "'Sansita Swashed', cursive",
    fontFamily: "'Segoe UI', sans-serif",
  },
});
