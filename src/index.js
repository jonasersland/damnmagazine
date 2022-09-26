import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import GlobalContextProvider from "./context/global-context";
import { CookiesProvider } from 'react-cookie';

ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <GlobalContextProvider>
          <App />
      </GlobalContextProvider>
    </BrowserRouter>
  </CookiesProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
