import React, { createContext, useState } from "react";
import { useCookies } from 'react-cookie';

export const GlobalContext = createContext({
  cursorType: "",
  cursorChangeHandler: () => {},
  globalLocalStorageSettings:"",
  setGlobalLocalStorageSettings: () =>{},
  title: "",
  setTitleHandler: () => {},
  menu: "",
  setMenuStateHandler: () => {},
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

const setShowPopupHandler = (state) => {
  setShowPopup(state);
};

const setMenuStateHandler = (state) => {
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
  }

  return (
    <GlobalContext.Provider
      value={{
        cursorType: cursorType,
        cursorChangeHandler: cursorChangeHandler,
        globalLocalStorageSettings:globalLocalStorageSettings,
        setGlobalLocalStorageSettings: setGlobalLocalStorageSettings,
        title: title,
        setTitleHandler: setTitleHandler,
        menuState: menuState,
        setMenuStateHandler:setMenuStateHandler,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
