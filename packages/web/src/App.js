import React from "react";
// import logo from './logo.svg';
import { BrowserRouter } from "react-router-dom";
import RouterApp from "./navigation/Router";
import { CookiesProvider } from "react-cookie";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiFab: {
      primary: {
        backgroundColor: '#18516c'
      },
      secondary: {
        backgroundColor: '#f9961f'
      }
    },
  },
});

function App() {
  //Magic bura console 
  // console.log = () => {};
  return (
    <ThemeProvider theme={theme}>
    <CookiesProvider>
        <RouterApp />
    </CookiesProvider>
    </ThemeProvider>
  );
}

export default App;
