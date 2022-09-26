import React, {useEffect, useState, useRef, createRef, useContext} from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import sanityClient from "../../client.js";
import './frontpage.styles.scss'

import imageUrlBuilder from '@sanity/image-url'
import SanityMuxPlayer from 'sanity-mux-player'
import { useMediaQuery } from 'react-responsive'

// import videojs from '@mux/videojs-kit';
// import videojs from '@mux/videojs-kit';
// import '@mux/videojs-kit/dist/index.css'; 

import { isSafari } from 'react-device-detect';

import ReactHlsPlayer from 'react-hls-player';

import '@vime/core/themes/default.css';

// Optional light theme (extends default). ~400B
import '@vime/core/themes/light.css';

import { Player,
    Hls,
    Ui,
    DefaultUi,
    DefaultControls, 
    ClickToPlay,
    Scrim,
    Controls,
    ControlSpacer,
    MuteControl,
    PlaybackControl,
    TimeProgress,
    LoadingScreen } from '@vime/react';

import styled from "styled-components";
import {Autoplay, Navigation, Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { GlobalContext } from "../../context/global-context"
import {returnImageHeight,returnFormattedTitle } from "../../utils/utils.js";

import SlideshowCursor from "../../components/slideshowCursor/slideshowCursor.component";
import Popup from "../../components/popup/popup.component";
import Footer from "../../components/footer/footer.component";
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import FadeInSection from "../../components/fadeInSection/fadeInSection.component.jsx"

import { BiPlay } from 'react-icons/bi';

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}
const SafariVideo = styled.video`
max-width: 100%;
max-height: 100%;
-o-object-fit: contain;
object-fit: contain;
-webkit-appearance: none;
`;

const Frontpage = ()=>{

    const [articleAmount, setArticleAmount] = useState('[0...10]')
    const [pageContent, setPageContent] = useState(null)
    const [sortedArticleRows, setSortedArticleRows] = useState(null)

    const [allowPopup, setAllowPopup] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false);

    const [mustPressPlay, setMustPressPlay] = useState(false);
    const [slideshowCanPlay,toggleSlideshowCanPlay] = useState(false)
    const [safariVideosCanPlay, toggleSafariVideosCanPlay] = useState(false)
    const [videoIndexPlaying, setVideoIndexPlaying] = useState(undefined)
    const [hidePlayButton, toggleHidePlayButton] = useState(false)

    const {cursorChangeHandler, cookies, cookiePreferences, setTitleHandler, showPopup, setShowPopupHandler} = useContext(GlobalContext);

    useEffect(()=>{
        setTitleHandler(`DAMN Magazine`)
    },[])

    const navigationPrevRef = useRef(null)
    const navigationNextRef = useRef(null)

    const slideshowVideoRefs = useRef([]);
    const firstVid = useRef()

  

    const navigate = useNavigate();

    const FourCol = useMediaQuery({ query: '(max-width: 1200px)' })
    const threeCol = useMediaQuery({ query: '(max-width: 700px)' })
    const oneCol = useMediaQuery({ query: '(max-width: 540px)' })
    const isNarrow = useMediaQuery({ query: '(max-width: 1100px)' })

    let singleWidthImage;
    let doubleWidthImage;
    let tripleWidthImage;
   
    if (oneCol){
        singleWidthImage = Math.round(window.innerWidth * 2)
        doubleWidthImage = Math.round(window.innerWidth * 2)
        tripleWidthImage = Math.round(window.innerWidth * 2)
        // console.log(singleWidthImage)
    } else if (threeCol){
        singleWidthImage = Math.round((window.innerWidth / 3) * 2)
        doubleWidthImage = Math.round((window.innerWidth / 1.5) * 2)
        tripleWidthImage = Math.round(window.innerWidth * 2)
        // console.log(singleWidthImage)
    } else if (FourCol){
        singleWidthImage = Math.round((window.innerWidth / 4) * 1.5)
        doubleWidthImage = Math.round((window.innerWidth / 4) * 3)
        tripleWidthImage = Math.round((window.innerWidth / 4) * 4.5)
    } else{
        singleWidthImage = Math.round((window.innerWidth / 5) * 1.5)
        doubleWidthImage = Math.round((window.innerWidth / 5) * 3)
        tripleWidthImage = Math.round((window.innerWidth / 5) * 4.5)
    }

    const swiperRef = useRef(null)
    const swiperVidRef = useRef([])
    const [sliderHasInit,setSliderHasInit] = useState(false)

    const returnVideoAspectRatio =()=>{
        if (isNarrow){
            let height = window.innerHeight - 60;
            let width = window.innerWidth;
            let ratio = width.toString() + ':' + height.toString();
            // console.log(ratio)
            return ratio
        } else{
            let height = window.innerHeight - 140;
            let width = window.innerWidth;
            let ratio = width.toString() + ':' + height.toString();
            
            return ratio
        }
    }

    const returnIsActive = (isActive)=>{
        // console.log(isActive);
        if (isActive && hidePlayButton){
            // console.log('active')
            return false;
        }else{
            return true
        }
        
    }

    const videoClicked = ()=>{
        // console.log('clicked')
        // toggleHidePlayButton(true)

        setTimeout(()=>{
            toggleHidePlayButton(true)
        },0)
    }

    // const [videosPlaying, setvideosPlaying] = useState([true,true,true])
    const videoPlaybuttonHandler = (index) =>{

        toggleSlideshowCanPlay(true);
        toggleSafariVideosCanPlay(true)
    
    }

    useEffect(() =>{ 
        // console.log('loading')
        let fetchContentQuery = `{'color':*[_type == 'frontpage']{color}[0],'slideshow':*[_type == 'frontpage']{slideshow[]{..., "image":[slideImage], "video": [video.asset->{...},thumbnail], 'slug':*[_id == ^.slideUrl._ref]{slug, _type}}}, 'articles': *[_type == 'frontpage']{blocks[][0..40]{'block':*[_id == ^._ref]{_id, _type, slug, url, trackingCode,trackingCodeSecond, title,thumbnail, doubleWidth,'highlightItem':highlightItem[0]{'asset':asset->},'eventData':[{startingTime, endingTime,city, place}], 'author':*[_id == ^.author._ref]{title}}[0]}}[0]}`
        sanityClient
        .fetch(fetchContentQuery)
        .then(data => {setPageContent(data)})
        .catch(console.error)
    },[]);

    const returnCaptionType =(type)=>{
        // console.log(type)
        switch (type){
            case 'article': return 'FEATURES'
            break;
            case 'researchreality': return 'RESEARCH & REALITIES'
            break;
            case 'event': return 'CALENDAR'
            default: return 'FEATURES'
        }
    }

    const returnInsetHTML =(code)=>{
        let newCode = code;
        
        function createMarkup(newCode) {

            let newCodeEdited = newCode.replace('${GDPR}', 'true').replace('${GDPR_CONSENT_755}', 'true').replace('dc_lat=', 'dc_lat=0').replace('tag_for_child_directed_treatment=','tag_for_child_directed_treatment=0').replace('tfua=', 'tfua=0').replace('ltd=','ltd=0');
            // gpdrEdited = newCode;
            // console.log(gpdrEdited)
            // newCode.replace('${GDPR_CONSENT_755}', 'true');

            if (newCodeEdited.includes('[timestamp]')){
                let timestampedCode = newCodeEdited.replace('[timestamp]', Date.now())
                // console.log('Displaying impression tag: ', timestampedCode)
                return {__html: timestampedCode};
            }else{
                return {__html: newCodeEdited};
            }
          }
            return <span dangerouslySetInnerHTML={createMarkup(newCode)} />;
    }

    const returnInsetIframeHTML =(code)=>{
        let marketingState = localStorage.marketing;
        if (marketingState == undefined || marketingState == 'false'){
            return <></>
        }
        let newCode = code;
        
        function createMarkup(newCode) {

            let newCodeEdited = newCode.replace('${GDPR}', 'true').replace('${GDPR_CONSENT_755}', 'true').replace('dc_lat=', 'dc_lat=0').replace('tag_for_child_directed_treatment=','tag_for_child_directed_treatment=0').replace('tfua=', 'tfua=0').replace('ltd=','ltd=0');
            // gpdrEdited = newCode;
            // console.log(newCodeEdited)
            // newCode.replace('${GDPR_CONSENT_755}', 'true');

            if (newCodeEdited.includes('[timestamp]')){
                let timestampedCode = newCodeEdited.replace('[timestamp]', Date.now())
                // console.log('Displaying impression tag: ', timestampedCode)
                return {__html: timestampedCode};
            }else{
                return {__html: newCodeEdited};
            }
          }
            return <span style={{position:'absolute', height:0, width:0}} dangerouslySetInnerHTML={createMarkup(newCode)} />;
    }


    const returnColAmount = ()=>{
        if (oneCol){return 'oneCol'}
        if (threeCol){return 'threeCol'}
        if (FourCol){return 'fourCol'}

        else return 'fiveCol'
    }

    const sortArticleRows = ()=>{ 

        let clonedPageContent = [...pageContent.articles.blocks]

        let rows = []
        let c = 0;
        let singleRow = [];

        function addToCount(block){
            if('doubleWidth' in block){
                if(block.doubleWidth == 'Single column'){
                    c = c+1
                }
                if(block.doubleWidth == 'Double column'){
                    c = c+2
                }
                if(block.doubleWidth == 'Triple column'){
                    c = c+3
                }
            } else{
                c = c+1
            }
        }

        if(returnColAmount() == 'fiveCol'){
            function addElement(){
                // console.log('adding element')
                if (clonedPageContent.length > 1){
                    // console.log('singleRow ', singleRow.length)
                    if (c <= 2){ // if there are less than two elements in array, any new block can be added
                        // console.log('adding ', clonedPageContent[0].block)
                        singleRow.push(clonedPageContent[0].block)
                        addToCount(clonedPageContent[0].block)
                        clonedPageContent.splice(0, 1)
                        addElement()
                    } else if (c === 3){ // if there are three elements only a double or single can be added
                        for (var i=0;clonedPageContent.length > i; i++){
                            if('doubleWidth' in clonedPageContent[i].block){
                                if(clonedPageContent[i].block.doubleWidth == 'Double column' || clonedPageContent[i].block.doubleWidth == 'Single column'){
                                    // console.log('adding ', clonedPageContent[i].block)
                                    singleRow.push(clonedPageContent[i].block)
                                    addToCount(clonedPageContent[i].block)
                                    clonedPageContent.splice(i, 1)
                                    addElement()
                                }
                            }
                            else{ // if there's no doubleWidth in the object it means that it's a single width item
                                // console.log('adding ', clonedPageContent[i].block)
                                singleRow.push(clonedPageContent[i].block)
                                addToCount(clonedPageContent[i].block)
                                clonedPageContent.splice(i, 1)
                                addElement()
                            }
                        }
                    } else if (c === 4){ // if there are four elements only a single can be added
                        for (var i=0;clonedPageContent.length > i; i++){
                            if('doubleWidth' in clonedPageContent[i].block){
                                if(clonedPageContent[i].block.doubleWidth == 'Single column'){
                                    // console.log('adding ', clonedPageContent[i].block)
                                    singleRow.push(clonedPageContent[i].block)
                                    addToCount(clonedPageContent[i].block)
                                    clonedPageContent.splice(i, 1)
                                    addElement()
                                }
                            }
                            else{ // if there's no doubleWidth in the object it means that it's a single width item
                                singleRow.push(clonedPageContent[i].block)
                                addToCount(clonedPageContent[i].block)
                                clonedPageContent.splice(i, 1)
                                addElement()
                            }
                        }
                    }else if (c === 5){

                        rows.push([...singleRow])
                        c=0;
                        singleRow = []
                        addElement()
                    }
                }
                else {
                    // console.log('ROWS', rows)
                    setSortedArticleRows(rows)
                    return
                }
            }
            addElement()
        }

        if(returnColAmount() == 'fourCol'){
            function addElement(){
                // console.log('adding element')
                if (clonedPageContent.length > 1){
                    // console.log('singleRow ', singleRow.length)
                    if (c < 2){ // if there are less than two elements in array, any new block can be added
                        // console.log('adding ', clonedPageContent[0].block)
                        singleRow.push(clonedPageContent[0].block)
                        addToCount(clonedPageContent[0].block)
                        clonedPageContent.splice(0, 1)
                        addElement()
                    } else if (c === 2){ // if there are two elements only a double or single can be added
                        for (var i=0;clonedPageContent.length > i; i++){
                            if('doubleWidth' in clonedPageContent[i].block){
                                if(clonedPageContent[i].block.doubleWidth == 'Double column' || clonedPageContent[i].block.doubleWidth == 'Single column'){
                                    // console.log('adding ', clonedPageContent[i].block)
                                    singleRow.push(clonedPageContent[i].block)
                                    addToCount(clonedPageContent[i].block)
                                    clonedPageContent.splice(i, 1)
                                    addElement()
                                }
                            }
                            else{ // if there's no doubleWidth in the object it means that it's a single width item
                                // console.log('adding ', clonedPageContent[i].block)
                                singleRow.push(clonedPageContent[i].block)
                                addToCount(clonedPageContent[i].block)
                                clonedPageContent.splice(i, 1)
                                addElement()
                            }
                        }
                    } else if (c === 3){ // if there are three elements only a single can be added
                        for (var i=0;clonedPageContent.length > i; i++){
                            if('doubleWidth' in clonedPageContent[i].block){
                                if(clonedPageContent[i].block.doubleWidth == 'Single column'){
                                    // console.log('adding ', clonedPageContent[i].block)
                                    singleRow.push(clonedPageContent[i].block)
                                    addToCount(clonedPageContent[i].block)
                                    clonedPageContent.splice(i, 1)
                                    addElement()
                                }
                            }
                            else{ // if there's no doubleWidth in the object it means that it's a single width item
                                singleRow.push(clonedPageContent[i].block)
                                addToCount(clonedPageContent[i].block)
                                clonedPageContent.splice(i, 1)
                                addElement()
                            }
                        }
                    }else if (c === 4){

                        rows.push([...singleRow])
                        c=0;
                        singleRow = []
                        addElement()
                    }
                }
                else {
                    // console.log('ROWS', rows)
                    setSortedArticleRows(rows)
                    return
                }
            }
            addElement()
        }

        if(returnColAmount() == 'threeCol'){
            function addElement(){
                // console.log('adding element')
                if (clonedPageContent.length > 1){
                    // console.log('singleRow ', singleRow.length)
                    if (c === 0){ // if there are no elements in the array, any new block can be added
                        // console.log('adding ', clonedPageContent[0].block)
                        singleRow.push(clonedPageContent[0].block)
                        addToCount(clonedPageContent[0].block)
                        clonedPageContent.splice(0, 1)
                        addElement()
                    } else if (c === 1){ // if there is one elements only a double or single can be added
                        for (var i=0;clonedPageContent.length > i; i++){
                            if('doubleWidth' in clonedPageContent[i].block){
                                if(clonedPageContent[i].block.doubleWidth == 'Double column' || clonedPageContent[i].block.doubleWidth == 'Single column'){
                                    // console.log('adding ', clonedPageContent[i].block)
                                    singleRow.push(clonedPageContent[i].block)
                                    addToCount(clonedPageContent[i].block)
                                    clonedPageContent.splice(i, 1)
                                    addElement()
                                }
                            }
                            else{ // if there's no doubleWidth in the object it means that it's a single width item
                                // console.log('adding ', clonedPageContent[i].block)
                                singleRow.push(clonedPageContent[i].block)
                                addToCount(clonedPageContent[i].block)
                                clonedPageContent.splice(i, 1)
                                addElement()
                            }
                        }
                    } else if (c === 2){ // if there are two elements only a single can be added
                        for (var i=0;clonedPageContent.length > i; i++){
                            if('doubleWidth' in clonedPageContent[i].block){
                                if(clonedPageContent[i].block.doubleWidth == 'Single column'){
                                    // console.log('adding ', clonedPageContent[i].block)
                                    singleRow.push(clonedPageContent[i].block)
                                    addToCount(clonedPageContent[i].block)
                                    clonedPageContent.splice(i, 1)
                                    addElement()
                                }
                            }
                            else{ // if there's no doubleWidth in the object it means that it's a single width item
                                singleRow.push(clonedPageContent[i].block)
                                addToCount(clonedPageContent[i].block)
                                clonedPageContent.splice(i, 1)
                                addElement()
                            }
                        }
                    }else if (c === 3){
                        rows.push([...singleRow])
                        c=0;
                        singleRow = []
                        addElement()
                    }
                }
                else {
                    // console.log('ROWS', rows)
                    setSortedArticleRows(rows)
                    return
                }
            }
            addElement()
        }

        if(returnColAmount() == 'threeCol'){
            function addElement(){
                // console.log('adding element')
                if (clonedPageContent.length > 1){
                    // console.log('singleRow ', singleRow.length)
                    if (c === 0){ // if there are no elements in the array, any new block can be added
                        // console.log('adding ', clonedPageContent[0].block)
                        singleRow.push(clonedPageContent[0].block)
                        addToCount(clonedPageContent[0].block)
                        clonedPageContent.splice(0, 1)
                        addElement()
                    } else if (c === 1){ // if there is one elements only a double or single can be added
                        for (var i=0;clonedPageContent.length > i; i++){
                            if('doubleWidth' in clonedPageContent[i].block){
                                if(clonedPageContent[i].block.doubleWidth == 'Double column' || clonedPageContent[i].block.doubleWidth == 'Single column'){
                                    // console.log('adding ', clonedPageContent[i].block)
                                    singleRow.push(clonedPageContent[i].block)
                                    addToCount(clonedPageContent[i].block)
                                    clonedPageContent.splice(i, 1)
                                    addElement()
                                }
                            }
                            else{ // if there's no doubleWidth in the object it means that it's a single width item
                                // console.log('adding ', clonedPageContent[i].block)
                                singleRow.push(clonedPageContent[i].block)
                                addToCount(clonedPageContent[i].block)
                                clonedPageContent.splice(i, 1)
                                addElement()
                            }
                        }
                    } else if (c === 2){ // if there are two elements only a single can be added
                        for (var i=0;clonedPageContent.length > i; i++){
                            if('doubleWidth' in clonedPageContent[i].block){
                                if(clonedPageContent[i].block.doubleWidth == 'Single column'){
                                    // console.log('adding ', clonedPageContent[i].block)
                                    singleRow.push(clonedPageContent[i].block)
                                    addToCount(clonedPageContent[i].block)
                                    clonedPageContent.splice(i, 1)
                                    addElement()
                                }
                            }
                            else{ // if there's no doubleWidth in the object it means that it's a single width item
                                singleRow.push(clonedPageContent[i].block)
                                addToCount(clonedPageContent[i].block)
                                clonedPageContent.splice(i, 1)
                                addElement()
                            }
                        }
                    }else if (c === 3){
                        rows.push([...singleRow])
                        c=0;
                        singleRow = []
                        addElement()
                    }
                }
                else {
                    // console.log('ROWS', rows)
                    setSortedArticleRows(rows)
                    return
                }
            }
            addElement()
        }
        
        if(returnColAmount() == 'oneCol'){
            let rows = []
            for (var i=0;pageContent.articles.blocks.length > i; i++){
                rows.push([pageContent.articles.blocks[i].block])
            }
            setSortedArticleRows(rows)
            // return rows;
        }
    }

    useEffect(()=>{
        if (!pageContent) return
        sortArticleRows()
    },[pageContent])

    // console.log(pageContent)

    if(!sortedArticleRows) return <></>
    return(
        <div className={`frontpage ${returnColAmount()}`}>
            {/* {console.log(sortedArticleRows)} */}
             <SlideshowCursor/>
            {/* {console.log()} */}
            {!isNarrow ?
                <Menu />
                :
                <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
            }

            <div className={`frontpage-content-wrapper`} style={{opacity: menuOpen ? 0 : 1}}>
                <div className="frontpage-slideshow-section">
                {/* <SlideshowCursor/> */}
                <Swiper
                    ref={swiperRef}

                    onAfterInit={(el)=>{
                        swiperVidRef.current = [...Array(el.slides.length).keys()].map(
                            (_, i) => swiperVidRef.current[i] ?? createRef()
                        );
                        setSliderHasInit(true)
                    }}

                    

                    onSlideResetTransitionStart={(el)=>{ //next
                        // console.log(el.slides)
                        if('slides' in el){

                            // setTimeout(function(){
                                let next = el.slides.filter(slide=>{
                                    return slide.classList.contains('swiper-slide-active')
                                })
                                if ('children' in next[0]){
                                    if('children' in next[0].children[0]){
                                        if('children' in next[0].children[0].children[0]){
                                            if (slideshowCanPlay){  
                                                next[0].children[0].children[0].children[0].play();
                                            }
                                        }
                                    }
                                }
    
                                let active = el.slides.filter(slide=>{
                                    return slide.classList.contains('swiper-slide-prev')
                                })
                                
                                if ('children' in active[0]){
                                    if('children' in active[0].children[0]){
                                        if('children' in active[0].children[0].children[0]){
                                            if (slideshowCanPlay){
                                                // console.log('pause', active[0].children[0].children[0].children[0].children[0])
                                                active[0].children[0].children[0].children[0].pause();
                                                active[0].children[0].children[0].children[0].currentTime = 0;
                                            }
                                        }
                                    }
                                }
                            // },0)
                            
                        }
                    }}

                    onSlideNextTransitionStart={(el)=>{ //next
                        // console.log(el.slides)
                        if('slides' in el){

                            // setTimeout(function(){
                                let next = el.slides.filter(slide=>{
                                    return slide.classList.contains('swiper-slide-active')
                                })
                                if ('children' in next[0]){
                                    if('children' in next[0].children[0]){
                                        if('children' in next[0].children[0].children[0]){
                                            if (slideshowCanPlay){  
                                                console.log(next[0])
                                                next[0].children[0].children[0].children[0].play();
                                            }
                                        }
                                    }
                                }
    
                                let active = el.slides.filter(slide=>{
                                    return slide.classList.contains('swiper-slide-prev')
                                })
                                
                                if ('children' in active[0]){
                                    if('children' in active[0].children[0]){
                                        if('children' in active[0].children[0].children[0]){
                                            if (slideshowCanPlay){
                                                // console.log('pause', active[0].children[0].children[0].children[0].children[0])
                                                active[0].children[0].children[0].children[0].pause();
                                                active[0].children[0].children[0].children[0].currentTime = 0;
                                            }
                                        }
                                    }
                                }
                            // },0)
                            
                        }
                    }}

                    onSlidePrevTransitionStart={(el)=>{ //prev
                        if('slides' in el){

                            // setTimeout(function(){

                                let next = el.slides.filter(slide=>{
                                    return slide.classList.contains('swiper-slide-active')
                                })
                                if ('children' in next[0]){
                                    if('children' in next[0].children[0]){
                                        if('children' in next[0].children[0].children[0]){
                                            if (slideshowCanPlay){  
                                                next[0].children[0].children[0].children[0].play();
                                            }
                                        }
                                    }
                                }

                                let active = el.slides.filter(slide=>{
                                    return slide.classList.contains('swiper-slide-next')
                                })
                                
                                if ('children' in active[0]){
                                    if('children' in active[0].children[0]){
                                        if('children' in active[0].children[0].children[0]){
                                            if (slideshowCanPlay){
                                                // console.log('pause', active[0].children[0].children[0].children[0].children[0])
                                                active[0].children[0].children[0].children[0].pause();
                                                active[0].children[0].children[0].children[0].currentTime = 0;
                                            }
                                        }
                                    }
                                }
                            // },0)
                            
                        }
                    }}
                    
                    className="frontpage-swiper"
                    
                    autoplay={{delay:7000}}
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                      }}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = navigationPrevRef.current;
                        swiper.params.navigation.nextEl = navigationNextRef.current;
                    }}
                    autoHeight={true}
                    loop={!isSafari}
                    rewind={isSafari}
                    // loop={true}
                    modules={[Navigation, Autoplay]}
                    >

                    {/* {!isSafari ?
                    <div
                        className="swiper-ref-prev safari-cursor-prev"
                        ref={navigationPrevRef}
                    />
                    : */}
                    <div
                        className="swiper-ref-prev"
                        ref={navigationPrevRef}
                        onMouseEnter={() => cursorChangeHandler("previous")}
                        onMouseLeave={() => cursorChangeHandler("")}
                    />    
                    {/* } */}

                    {/* {!isSafari ?
                    <div
                        className="swiper-ref-next safari-cursor-next"
                        ref={navigationNextRef}
                    />
                    :  */}
                    <div
                    //do a check to see if it's safari and if it's final
                        className="swiper-ref-next"
                        ref={navigationNextRef}
                        onMouseEnter={() => cursorChangeHandler("next")}
                        onMouseLeave={() => cursorChangeHandler("")}
                    />    
                    {/* } */}
                        {/* {console.log(pageContent.slideshow[0].slideshow)} */}
                        {pageContent.slideshow[0].slideshow.map((slide, index)=>{
                            return <SwiperSlide key={slide._key}>
                                {({ isActive }) => (<>
                                            {slide.image[0] !== null ?
                                                <div className='swiper-image' onClick={()=>navigate(slide.slug[0].slug.current)}>
                                                    <img src={urlFor(slide.image[0]).width(window.innerWidth).url()}/>
                                                </div>
                                            :
                                            slide.video[0] !== null ?
                                            
                                                <div className="swiper-video"
                                                // onClick={()=>navigate(slide.slug[0].slug.current)}
                                                >
                                                    {isSafari ?
                                                    <>  
                                                        {sliderHasInit ?
                                                        <>
                                                        {!isNarrow ?
                                                        <div className={`safari-video-wrapper`}>
                                                           
                                                            <Player
                                                            className="vime-player"

                                                            // only render the coming video upon clicking the slide?
                                                            // onClick={()=>console.log('clicked video')}
                                                            // onClick={()=>toggleSlideshowCanPlay(true)}
                                                            currentSrc={`https://stream.mux.com/${slide.video[0].playbackId}.m3u8`}
                                                            poster={'thumbnail' in slide ? urlFor(slide.thumbnail.asset).width(window.innerWidth).url() : `https://image.mux.com/${slide.video[0].playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`}
                                                            controls='false'
                                                            playsinline
                                                            viewType='video'
                                                            aspectRatio={returnVideoAspectRatio()}
                                                            muted
                                                            // autoplay={true}
                                                            
                                                            loop
                                                            // paused={false}
                                                            paused={returnIsActive(isActive)} // paused need a 
                                                            onVmPausedChange={()=>videoClicked()}
                                                            // onVmPlay={()=>videoClicked()}
                                                            // ref={swiperVidRef.current[index]}
                                                            > 
                                                                <DefaultUi ClickToPlay noControls noSpinner>
                                                                
                                                                    <ClickToPlay useOnMobile='true'/>
                                                                    
                                                                </DefaultUi>
                                                                <Hls version="latest" poster={'thumbnail' in slide ? urlFor(slide.thumbnail.asset).width(window.innerWidth).url() : `https://image.mux.com/${slide.video[0].playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`}>
                                                                    <source data-src={`https://stream.mux.com/${slide.video[0].playbackId}.m3u8`} type="application/x-mpegURL" />
                                                                </Hls>
                                                            </Player>
                                                   

                                                            <div className={`video-play-button ${hidePlayButton ? 'play-fadeout' : ''}`}>
                                                                <BiPlay/>
                                                            </div>

                                                        </div>
                                                        :
                                                        <div className="safari-iphone-wrapper">
                                                            <ReactHlsPlayer
                                                            // swiperVidRef={()=>returnRef(index)}
                                                            playerRef={swiperVidRef.current[index]}
                                                            src={`https://stream.mux.com/${slide.video[0].playbackId}.m3u8`}
                                                            // controls={true}
                                                            muted={true}
                                                            loop={true}
                                                            playsInline={true}
                                                            controls={false}
                                                            autoPlay={true}
                                                            width="100%"
                                                            height="auto"
                                                            // hlsConfig={config}
                                                            // poster={`https://image.mux.com/${slide.video[0].playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`}
                                                            > 
                                                                <source src={`https://stream.mux.com/${slide.video[0].playbackId}.m3u8`} type="application/x-mpegURL" />
                                                            </ReactHlsPlayer> 
                                                            {/* <SanityMuxPlayer
                                                                // onClick={()=>navigate(slide.slug[0].slug.current)}
                                                                assetDocument={slide.video[0]}
                                                                autoload={true}
                                                                className={'video-inner-wrapper'}
                                                                height={'100%'}
                                                                loop={true}
                                                                playsInline={true}
                                                                muted={true}
                                                                autoplay={true}
                                                                showControls={false}
                                                                width={'100%'}
                                                                // poster={`https://image.mux.com/${slide.video[0].playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`} // defaults to true, an URL can be provided to override the Mux asset thumbnail
                                                            /> */}
                                                        </div>
                                                        }
                                                        </>
                                                        :
                                                        ''
                                                        }
                                                      
                                                     {/* <div className={`swiper-video-thumbnail ${safariVideosCanPlay ? 'thumbnail-fadeout' : ''}`}>
                                                        <img src={`https://image.mux.com/${slide.video[0].playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`}/>
                                                    </div>  */}
                                                    
                                                    {/* <div
                                                        ref={swiperVidRef.current[index]}
                                                    >
                                                        <ReactHlsPlayer
                                                            src={`https://stream.mux.com/${slide.video[0].playbackId}.m3u8`}
                                                            muted={true}
                                                            loop={true}
                                                            playsInline={true}
                                                            controls={false}
                                                            // autoPlay={true}
                                                            width="100%"
                                                            height="auto"
                                                        />
                                                    </div> */}
                                                    </>
                                                    :
                                                    
                                                    
                                                    <SanityMuxPlayer
                                                    
                                                    onClick={()=>navigate(slide.slug[0].slug.current)}
                                                    assetDocument={slide.video[0]}
                                                    autoload={true}
                                                    className={'video-inner-wrapper'}
                                                    height={'100%'}
                                                    loop={true}
                                                    playsInline={true}
                                                    muted={true}
                                                    autoplay={true}
                                                    showControls={false}
                                                    width={'100%'}
                                                    poster={'thumbnail' in slide ? urlFor(slide.thumbnail.asset).width(window.innerWidth).url() : `https://image.mux.com/${slide.video[0].playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`} // defaults to true, an URL can be provided to override the Mux asset thumbnail
                                                    />
                                                    
                                                }
                                                    
                                                    
                                                    
                                                    
                                                {/* {console.log(slide.video[0].playbackId)}*/}
                                                {/* {returnHtmlVideo(slide.video[0].playbackId,slide.slug[0].slug.current,index)}  */}
                                               


                                                {/* <div
                                                    ref={swiperVidRef.current[index]}
                                                > */}
                                                    {/* <SanityMuxPlayer
                                                        ref={swiperVidRef.current[index]}
                                                        assetDocument={slide.video[0]}
                                                        autoload={true}
                                                        className={'video-inner-wrapper'}
                                                        height={'100%'}
                                                        loop={true}
                                                        playsInline={true}
                                                        muted={true}
                                                        autoplay={true}
                                                        showControls={false}
                                                        // onCanPlay={()=>videoCanPlayHandler(index)}
                                                        width={'100%'}
                                                        poster={`https://image.mux.com/${slide.video[0].playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`} // defaults to true, an URL can be provided to override the Mux asset thumbnail
                                                        
                                                    /> */}
                                                    {/* <ReactHlsPlayer
                                                        src={`https://stream.mux.com/${slide.video[0].playbackId}.m3u8`}
                                                        muted={true}
                                                        loop={true}
                                                        playsInline={true}
                                                        controls={false}
                                                        autoPlay={true}
                                                        width="100%"
                                                        height="auto"
                                                    /> */}
                                                {/* </div> */}


                                                {/* <div dangerouslySetInnerHTML={{
                                                __html: `
                                                <video
                                                loop
                                                class="video-js vjs-16-9" 
                                                muted
                                                autoplay
                                                playsinline
                                                preload="metadata"
                                                >
                                                    <source src="https://stream.mux.com/${slide.video[0].playbackId}.m3u8" type="video/mux" />
                                                </video>
                                                `
                                                }} /> */}
                                                {/* <video 
                                                    id="my-player" 
                                                    class="video-js vjs-16-9" 
                                                    controls 
                                                    preload="auto" 
                                                    width="100%"
                                                    data-setup='{}'
                                                >
                                                    <source src={slide.video[0].playbackId} type="video/mux" />
                                                </video>  */}
                                                
                                                {/* <SanityMuxPlayer
                                                    assetDocument={slide.video[0]}
                                                    autoload={true}
                                                    // ref={swiperVidRef.current[index]}
                                                    className={'video-inner-wrapper'}
                                                    height={'100%'}
                                                    // width={window.innerWidth}
                                                    loop={true}
                                                    muted={true}
                                                    autoplay={true}
                                                    showControls={false}
                                                    // onCanPlay={console.log('can play')}
                                                    onCanPlay={()=>videoCanPlayHandler(index)}
                                                    width={'100%'}
                                                    poster={`https://image.mux.com/${slide.video[0].playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`} // defaults to true, an URL can be provided to override the Mux asset thumbnail
                                                    playsInline={true}
                                                    // playsinline={true}
                                                /> */}
                                                {/* {console.log(slide.video[0])} */}
                                                {/* <div className='swiper-video-thumbnail'>
                                                    <img src={`https://image.mux.com/${slide.video[0].playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`}/>
                                                </div> */}
                                            </div>
                                            :''}
                                            <div className="swiper-caption-wrapper">
                                                {/* {console.log(slide.slug[0])} */}
                                                <div className="swiper-caption theme-color" onClick={()=>navigate(slide.slug[0].slug.current)}>
                                                    <div className="swiper-caption-type">{returnCaptionType(slide.slug[0]._type)}</div>
                                                    <div className="swiper-caption-title">{returnFormattedTitle(slide.slideTitle)}</div>
                                                </div>
                                            </div>
                                        </>)}
                            </SwiperSlide>
                        })}

                </Swiper>
                </div>
                <div className="frontpage-article-section">
                    
                    {/* {console.log(articleRows())} */}
                    {sortedArticleRows.map((row, index)=>{
                        return (
                            <div key={'r'+index} className="frontpage-article-row">
                            <FadeInSection >
                        
                            {row.map(article =>{
                                // console.log(article)
                              
                                let imageHeight = {ratio: 'height-ratio-100', value: 1}
                                let isDoubleWidth = 'doubleWidth' in article && article.doubleWidth == 'Double column';
                                let isTripleWidth = 'doubleWidth' in article && article.doubleWidth == 'Triple column';
                               
                                if (article.highlightItem !== null){
                                    // console.log(article)
                                    imageHeight = returnImageHeight(article.highlightItem.asset._id)
                                } 
                                
                            return (
                            <div className={`frontpage-article ${isTripleWidth ? 'triple-width' : isDoubleWidth ? 'double-width' : 'single-width' }`} >
                                
                                <a target={article._type == 'ad' ? '_blank' : '_self'} href={'slug' in article ? '/' + article.slug.current : article.url}>
                                    <div className={`frontpage-article-image ${article._type !== 'ad' ? 'theme-color-image' : ''} ${isDoubleWidth && !oneCol || isTripleWidth && !oneCol ? 'height-ratio-100' : imageHeight.ratio }`}>
                                    {/* {article._type == 'ad' ? console.log(article.highlightItem.asset) : ''} */}
                                        {'highlightItem' in article ? 

                                            article.highlightItem.asset._type == 'sanity.imageAsset' ?
                                                <>
                                                {article.highlightItem.asset.extension == 'gif' ? 
                                                    <img src={urlFor(article.highlightItem.asset._id).width(isTripleWidth ? tripleWidthImage : isDoubleWidth ? doubleWidthImage : singleWidthImage).url()}/>
                                                    :
                                                    <img src={urlFor(article.highlightItem.asset._id).width(isTripleWidth ? tripleWidthImage : isDoubleWidth ? doubleWidthImage : singleWidthImage).format('jpg').url()}/>

                                                }
                                                </>
                                            :

                                                <div className="video-thumbnail-wrapper">
                                                    {/* {console.log(article)} */}
                                                    <div className="video-play-button">
                                                        <BiPlay/>
                                                    </div>
                                                    {'thumbnail' in article ?
                                                        <img src={ urlFor(article.thumbnail.asset).width(window.innerWidth).url()}/> 
                                                    :
                                                        <img src={`https://image.mux.com/${article.highlightItem.asset.playbackId}/thumbnail.jpg?width=${singleWidthImage}`}/>
                                                    }
                                                </div>
                                            :
                                            ''
                                        }
                                    </div>
                                
                                <div className="frontpage-article-label">
                                    <div className="frontpage-article-title">
                                        {article._type !== 'ad' ? returnFormattedTitle(article.title) : ''}
                                    </div>
                                    <div className="frontpage-article-byline">
                                        {article.author.length > 0 ? article.author[0].title : ''}
                                        {article._type == 'event' && article.eventData[0].city !== undefined ? article.eventData[0].city[0].label : ''}<br/>
                                        {article._type == 'event' && article.eventData[0].place !== undefined ? article.eventData[0].place[0].label : ''}
                                    </div>
                                    {'trackingCode' in article ? returnInsetIframeHTML(article.trackingCode) : ''}
                                    {/* {'trackingCodeSecond' in article ? returnInsetIframeHTML(article.trackingCodeSecond) : ''} */}
                                </div>
                                </a>
                            </div>)
                        })}
                        </FadeInSection>
                        </div>
                        )
                    })}
                </div>
            </div>
            <div className="page-navigation-wrapper">
                    <div className="page-navigation-option">
                        <a href='/features'>
                            FEATURES
                        </a>
                    </div>
                    <div className="page-navigation-option" >
                        <span className="page-navigation-separator">/</span>
                        <a href='/calendar'>
                            CALENDAR
                        </a>
                    </div>
                    <div className="page-navigation-option" >
                        <span className="page-navigation-separator">/</span>
                        <a href='/research-realities'>
                            RESEARCH & REALITIES
                        </a>
                    </div>
                </div>
            <Footer type={'general'}/> 
        </div>
    )
}

export default Frontpage