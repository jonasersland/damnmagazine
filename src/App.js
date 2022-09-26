import React, {useEffect, useState, useContext} from "react";
import { Helmet } from 'react-helmet';
import './App.scss';

import {
  Link,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Frontpage from './pages/frontpage/frontpage.page'
import Article from './pages/article/article.page'
import Contact from './pages/contact/contact.page'
import About from './pages/about/about.page'
import Issues from './pages/issues/issues.page'
import SingleIssue from './pages/issues/singleIssue.page'
import Advertise from './pages/advertise/advertise.page'
import TermsConditions from './pages/impressum/terms-conditions.page'
import PrivacyPolicy from './pages/impressum/privacy-policy.page'

import CollectionPage from './pages/collection-page/collection-page.page'
import FeaturesPage from './pages/collection-page/features-page.page'
import ResearchRealitiesPage from './pages/collection-page/research-realities-page.page'
import SearchPage from './pages/collection-page/search-page.page'
import CalendarPage from './pages/collection-page/calendar-page.page'

import CookiesPopup from "./components/cookies-popup/cookies-popup.component";
import Popup from "./components/popup/popup.component";

import { GlobalContext } from "./context/global-context"

// import ReactGA from "react-ga4";
import ReactGA from "react-ga";

import sanityClient from "./client.js";

import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
a{
  color: black;
}
a:hover{
  color: ${props => props.color}
}
.saturated-link{
  color: ${props => props.color}
}
.theme-color-text{
  color: ${props => props.color} !important;
}
.theme-color:hover{
  color: ${props => props.color} !important;
}
.theme-color-fill:hover path{
  fill: ${props => props.color} !important;
}
.theme-color-stroke:hover path{
  stroke: ${props => props.color} !important;
}
.theme-color-bg:hover{
  color: ${props => props.color}
}
.menu-section-logo:hover .damn-logo {
  fill: ${props => props.color}
}
.theme-color-image{
  background: ${props => props.color}
}
.footer-article-image{
  background: ${props => props.color}
}
.collection-page-article-image{
  background: ${props => props.color}
}
`;
 

function App() {

  const [color, setColor]=useState(null)
  const [cookiesPreferenceShowing, setCookiesPreferenceShowing] = useState(true)
  const [localStorageSettings, setLocalStorageSettings] = useState(null)
  const [appLevelMenuState,toggleAppLevelMenuState] =useState(false)
  const [showPopup, setShowPopup] = useState(true)

  let location = useLocation();

  const {setGlobalLocalStorageSettings, title, menuState, setMenuStateHandler} = useContext(GlobalContext);
  // console.log(cookiePreferences)

  // useEffect(()=>{
  //   console.log(location)
  //   // ReactGA.initialize("G-P1V2Q87GGP");
  //   ReactGA.send({ hitType: "pageview", page: location.pathname });
  //   // ReactGA.send("pageview");
  // },[])


useEffect(() =>{ 
    let fetchContentQuery = `{'color':*[_type == 'settings']{color}[0]}`
    sanityClient
    .fetch(fetchContentQuery)
    .then(data => {setColor(data.color.color.hex)})
    .catch(console.error)
    
    let localStorageSettings = {
        'preferences': localStorage.getItem('cookiesPreferenceSet'), 
        'statistic': localStorage.getItem('statistic'), 
        'marketing': localStorage.getItem('marketing'),
        'popup': localStorage.getItem('popup'),
      }
      // console.log(localStorageSettings)

    if (localStorageSettings.preferences == null){
      // user has not yet defined preferences
      // console.log('showing cookies')
      // setCookiesPreferenceShowing(true)
    }else{
      //user has already defined preferences
      //setLocalStorageSettings(localStorageSettings)
      setCookiesPreferenceShowing(false)
        if(localStorageSettings.statistic == true){







          ReactGA.initialize("UA-9775515-1");
          ReactGA.pageview(location.pathname);





        }
    }
    if(localStorageSettings.popup == null){
      let popupState = JSON.stringify({'initDate': Date.now(), 'viewCount': 0})
      // console.log(popupState)
      localStorage.setItem('popup', popupState)
      setShowPopup(true)
    }else{
      let initDate = JSON.parse(localStorage.getItem('popup')).initDate;
      let now = Date.now();
      let timePassed = now - initDate;
      // console.log(timePassed)
      //1209600000
      if(timePassed > 1209600000){
        console.log('resetting')
        let newPopupState = JSON.stringify({'initDate': Date.now(), 'viewCount': 0})
        localStorage.setItem('popup', newPopupState)
      }
      // console.log('checking if can show popup')
      setShowPopup(canShowPopup())
    }
  },[]);

  useEffect(()=>{
    // console.log(localStorageSettings)
    //after cookiepreferences has been set, close popupwindow and init GA if allowed
    if (localStorageSettings == null || localStorageSettings == false){return}
      
    setCookiesPreferenceShowing(false)

    let newGlobalLocalStorageSettings ={
      cookiesPreferenceSet:true,
      statistic:false,
      marketing: false,
      // popup:{initDate:'', viewCount:0}
    };

    if (localStorageSettings.statistic == true){
      console.log('pageview ' + location.pathname)

      ReactGA.initialize("UA-9775515-1")
      ReactGA.pageview(location.pathname)

      newGlobalLocalStorageSettings.statistic = true
      // set statistic settings in context
    }

    if (localStorageSettings.marketing == true){
      newGlobalLocalStorageSettings.marketing = true
      // set marketing setting in context
    }
    // set popup stats in context 
    setGlobalLocalStorageSettings(localStorageSettings)
  },[localStorageSettings])

  useEffect(()=>{
    // console.log(location.pathname)
    let stats = localStorage.getItem('statistic')
    // console.log(stats)
    // maybe this state gets updated each time page loads – maybe just retrieve it from localstorage>
    if (stats == 'true'){
      // console.log('pageview', location.pathname)





      ReactGA.initialize("UA-9775515-1")
      ReactGA.pageview(location.pathname)







    }
  },[location])

const canShowPopup =()=>{
  // let popupSettings = localStorage.getItem('popup');
  let count = JSON.parse(localStorage.getItem('popup')).viewCount;
  // console.log(count)
  if(count < 3){
    return true
  } else{
    return false
  }
}

const popupCloseHandler = ()=>{
  // close popup
  // get int from the viewcount
  const count = JSON.parse(localStorage.getItem('popup')).viewCount;
  const date = JSON.parse(localStorage.getItem('popup')).initDate;
  // console.log(date)
  const updatedPopupState = {'initDate': date, 'viewCount': count + 1}
  // console.log(updatedPopupState)
  localStorage.setItem('popup', JSON.stringify(updatedPopupState))
  setShowPopup(false)
}

const handleScroll = () => {
  // console.log(appLevelMenuState)
    if (menuState === true){
        setMenuStateHandler(false)
    }
    if (location.pathname == '/'){
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 200
      if (bottom) {
        setShowPopup(canShowPopup())
        // CHECK IF YOU CAN SHOW POPUP
        // setShowPopupHandler(true)
      }
    }
};

useEffect(() => {
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuState]);
// console.log(cookiesPreferenceShowing)
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <GlobalStyle color={color}/>
      {showPopup ? <Popup popupCloseHandler={popupCloseHandler}/> : ''}

      {cookiesPreferenceShowing ?
          <CookiesPopup localStorageSettings={localStorageSettings} setLocalStorageSettings={setLocalStorageSettings} />
          : ''
      } 
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/contact" exact element={<Contact />} />
        <Route path="/about" exact element={<About />} />
        <Route path="/archive" exact element={<Issues />} />
        <Route path="/mediakit" exact element={<Advertise />} />
        <Route path="/calendar" exact element={<CalendarPage />} />
        <Route path="/calendar/:slug" element={<CalendarPage />} />
        <Route path="/terms-conditions" exact element={<TermsConditions />} />
        <Route path="/privacy-policy" exact element={<PrivacyPolicy />} />
        <Route path="/features" exact element={<FeaturesPage tags={['Design', 'Art', 'Architecture']} />} />
        <Route path="/features/:slug" element={<FeaturesPage tags={['Design', 'Art', 'Architecture']} />} />
        <Route path="/research-realities" exact element={<ResearchRealitiesPage tags={['COMPANY NEWS', 'PRODUCT', 'INSTITUTION']} />} />
        <Route path="/research-realities/:slug" element={<ResearchRealitiesPage tags={['COMPANY NEWS', 'PRODUCT', 'INSTITUTION']} />} />
        <Route path="/tag/:slug" element={<CollectionPage title={'TAG'} tags={[]} />} />
        <Route path="/issue-search/:slug" element={<CollectionPage title={'ISSUE'} tags={[]} />} />
        <Route path="/author/:slug" element={<CollectionPage title={'AUTHOR'} tags={[]} />} />
        <Route path="/search/:slug" element={<SearchPage/>} />     
        <Route path="/issue/:slug" element={<SingleIssue/>} />        
        <Route path="/:slug" element={<Article />} />
      </Routes>
    </div>

  );
}

export default App;
