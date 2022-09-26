import React, { createContext, useState } from "react";
import { useCookies } from 'react-cookie';

export const GlobalContext = createContext({
  cursorType: "",
  cursorChangeHandler: () => {},
  // cookiePreferences: "",
  // setCookiePreferencesHandler: () => {},
  globalLocalStorageSettings:"",
  setGlobalLocalStorageSettings: () =>{},
  // cookies: "",
  // setCookieHandler: () => {},
  title: "",
  setTitleHandler: () => {},
  menu: "",
  setMenuStateHandler: () => {},
  // showPopup: "",
  // setShowPopupHandler: ()=>{}
});

const GlobalContextProvider = (props) => {

  const [cursorType, setCursorType] = useState("");
  const [cookiePreferences, setCookiePreferences] = useState(false);
  const [globalLocalStorageSettings, setGlobalLocalStorageSettings] = useState(null)
  const [cookies, setCookie] = useCookies(['popup']);
  const [title, setTitle] = useState('DAMN Magazine');
  const [menuState, setMenuState] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupState, setPopupState] = useState(null)
// const [cookies, setCookie] = useState(0);

const setShowPopupHandler = (state) => {
  // console.log('setting ', state)
  setShowPopup(state);
};

const setMenuStateHandler = (state) => {
  // console.log('setting ', state)
  setMenuState(state);
};

const setTitleHandler = (title) => {
  setTitle(title);
};

  const cursorChangeHandler = (cursorType) => {
    setCursorType(cursorType);
  };

  const setGlobalLocalStorageSettingsHandler = (settings) =>{
    setGlobalLocalStorageSettings(settings)
  }

  const setCookiePreferencesHandler =(preferences)=>{
    // console.log(preferences)
    // localStorage.setItem("cookiesPreferenceSet", true)
    // localStorage.setItem("statistic", preferences.statistic)
    // localStorage.setItem("marketing", preferences.marketing)
    // setCookiePreferences(true)
    //console.log(localStorage)
    //setCookiePreferences({'statistic':preferences.statistic,'marketing':preferences.marketing})
  }

  //console.log('cookiePreferences', cookiePreferences)



  // const setCookieHandler = ()=>{
  //   console.log(cookies)
  //     if('popup' in cookies){
  //           if ('num' in cookies.popup){
  //               // console.log('num', cookies)

  //               setCookie('popup', {num: cookies.popup.num+1}, { path: '/' });
  //           }
  //           else{
  //               // console.log('no num', cookies)
  //               setCookie('popup', {num: 1}, { path: '/' });
  //           }
  //       }else{
  //           // console.log('no popup', cookies)
  //           setCookie('popup', {num: 1}, { path: '/' });
  //       }
  //   }

  return (
    <GlobalContext.Provider
      value={{
        cursorType: cursorType,
        cursorChangeHandler: cursorChangeHandler,
        // cookiePreferences: cookiePreferences,
        // setCookiePreferencesHandler: setCookiePreferencesHandler,
        // cookies: cookies,
        globalLocalStorageSettings:globalLocalStorageSettings,
        setGlobalLocalStorageSettings: setGlobalLocalStorageSettings,
        // setCookieHandler: setCookieHandler,
        title: title,
        setTitleHandler: setTitleHandler,
        menuState: menuState,
        setMenuStateHandler:setMenuStateHandler,
        // showPopup: showPopup,
        // setShowPopupHandler: setShowPopupHandler,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
