import React from "react";
// import logo from './logo.svg';
import { BrowserRouter } from "react-router-dom";
import RouterApp from "./reducers/Router";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <RouterApp />
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
