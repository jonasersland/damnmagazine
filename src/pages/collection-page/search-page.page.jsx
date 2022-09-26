import React, {useEffect, useState, useRef, useContext} from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import sanityClient from "../../client.js";
import './collection-page.styles.scss'
import imageUrlBuilder from '@sanity/image-url'
import { useMediaQuery } from 'react-responsive'

import Footer from "../../components/footer/footer.component";
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import FadeInSection from "../../components/fadeInSection/fadeInSection.component.jsx"

import {returnFormattedTitle } from "../../utils/utils.js";

import { BiPlay } from 'react-icons/bi';
import { GlobalContext } from "../../context/global-context"

import {GrClose} from 'react-icons/gr'

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}

const SearchPage = ({tags})=>{

    const [articleAmount, setArticleAmount] = useState('[0...10]');
    const [pageContent, setPageContent] = useState(null)
    const FourCol = useMediaQuery({ query: '(max-width: 1200px)' })
    const threeCol = useMediaQuery({ query: '(max-width: 700px)' })
    const oneCol = useMediaQuery({ query: '(max-width: 540px)' })
    const isNarrow = useMediaQuery({ query: '(max-width: 1100px)' })

    let singleWidthImage;
   
    if (oneCol){
        singleWidthImage = Math.round(window.innerWidth * 2)
    } else if (threeCol){
        singleWidthImage = Math.round((window.innerWidth / 3) * 2)
    } else if (FourCol){
        singleWidthImage = Math.round((window.innerWidth / 4) * 2)
    } else{
        singleWidthImage = Math.round((window.innerWidth / 5) * 2)
    }

    const [queryFilter, setQueryFilter] = useState(null)
    // const [query, setQuery] = useState(`{'articles': *[_type == 'article']{_id,originallyPublished, _createdAt, _type, slug, title, doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}} | order(_createdAt desc) | order(originallyPublished desc)}`) 
    const [query, setQuery] = useState(null)
    const [activeTag, setActiveTag] = useState('')

    const [searchInput, setSearchInput] = useState('')

    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const {setTitleHandler} = useContext(GlobalContext);
    setTitleHandler('DAMN Magazine - Search')


    useEffect(()=>{
        let tagArray = location.pathname.split('/');
        let tag = tagArray[tagArray.length -1];
        // console.log(tag)
        setActiveTag(tag);
        setSearchInput(tag);
        let optionCap = tag.charAt(0).toUpperCase() + tag.slice(1);
        let optionLower = tag.toLowerCase();
        console.log(optionCap, optionLower)
        setQuery(`{'articles': *[_type == 'researchreality' && text[].children[].text match "${optionCap}" || _type == "researchreality" && title match "${optionCap}"  || _type == 'article' && text[].children[].text match "${optionCap}" || _type == "article" && title match "${optionCap}" || _type == 'researchreality' && text[].children[].text match "${optionLower}" || _type == "researchreality" && title match "${optionLower}"  || _type == 'article' && text[].children[].text match "${optionLower}" || _type == "article" && title match "${optionLower}" || _type == 'event' && text[].children[].text match "${optionCap}" || _type == "event" && title match "${optionCap}"  || _type == 'event' && text[].children[].text match "${optionLower}" || _type == "event" && title match "${optionLower}" ] {_id, _type, slug, title,thumbnail,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}}}`)

        // setQuery(`{'articles': *[_type == "article" && text[].children[].text match "${tag}" || _type == "article" && title match "${tag}" || _type == "researchreality" && text[].children[].text match "${tag}" || _type == "researchreality" && title match "${tag}"]{_id,_createdAt, originallyPublished, _type, slug, title,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}} | order(_createdAt desc) | order(originallyPublished desc)}`) 
    },[location])

    useEffect(() =>{ 
        if(!query) {return}
        // let fetchContentQuery;
        // if(type == 'type'){
            // fetchContentQuery = `{'articles': *[_type == 'article']{_id, _type, slug, title,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}}}`
            // setNavigationTitle(parameter)
            // setNavigationOptions([{label:'art',type:'tag'},{label:'architecture',type:'tag'},{label:'design',type:'tag'}])
        // } else if(type == 'tag'){
        //     let tagArray = location.pathname.split('/');
        //     let tag = tagArray[tagArray.length -1]
        //     fetchContentQuery = `{'articles': *["${tag}" in tags[].label] {_id, _type, slug, title,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}}}`
        //     setNavigationTitle(tag)
        // }
        // else if(type == 'search'){
        //     let tagArray = location.pathname.split('/');
        //     let tag = tagArray[tagArray.length -1]
        //     fetchContentQuery = `{'articles': *[_type == "article" && text[].children[].text match "${tag}"]{_id, _type, slug, title,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}}}`
        //     setNavigationTitle('Search')
        // }

        sanityClient
        .fetch(query)
        .then(data => {setPageContent(data)})
        .catch(console.error)
    },[query]);

    const pageNavigationHandler = (option)=>{
        if (!option){
            setQuery(`{'articles': *[_type == 'article' || _type == 'researchreality'] {_id, _type, slug, title,thumbnail,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}}}`)
            setActiveTag('')
        }
        let optionCap = option.charAt(0).toUpperCase() + option.slice(1);
        let optionLower = option.toLowerCase();
        console.log(optionCap, optionLower)
        setQuery(`{'articles': *[_type == 'researchreality' && text[].children[].text match "${optionCap}" || _type == "researchreality" && title match "${optionCap}"  || _type == 'article' && text[].children[].text match "${optionCap}" || _type == "article" && title match "${optionCap}" || _type == 'researchreality' && text[].children[].text match "${optionLower}" || _type == "researchreality" && title match "${optionLower}"  || _type == 'article' && text[].children[].text match "${optionLower}" || _type == "article" && title match "${optionLower}" || _type == 'event' && text[].children[].text match "${optionCap}" || _type == "event" && title match "${optionCap}"  || _type == 'event' && text[].children[].text match "${optionLower}" || _type == "event" && title match "${optionLower}" ] {..., _id, _type, slug, title,thumbnail,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}}}`)
        setActiveTag(option)
    }

    const searchFieldHandler =(e)=>{
        // console.log(e)
        if (e.key == 'Enter'){
            // console.log(searchInput)
            // setQuery(`{'articles': *[_type == "article" && text[].children[].text match "${searchInput}" || _type == "researchreality" && text[].children[].text match "${searchInput}"]{_id, _type, slug, title,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}}}`)
            window.location.href = '/search/' + searchInput
            // setQuery(`{'articles': *[_type == "article" && text[].children[].text match "${searchInput}" || _type == "researchreality" && text[].children[].text match "${tag}"]{_id, _type, slug, title,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}}}`)
        }

        // navigate('/')
    }

    const returnSearchInputWidth = (txt, font)=>{
            let element = document.createElement('canvas');
            let context = element.getContext("2d");
            context.font = font;
            return context.measureText(txt).width;
        
    }

    const returnImageHeight = (asset)=>{
        // console.log(asset)
        const string = asset.split("-");
        const size = string[2].split("x");
        
        const getDimension =(size)=>{
            let ratio = size[0] / size[1];
            // console.log(ratio);
            if (ratio > 1.3){
                return {ratio: 'height-ratio-025', value: ratio}
            }
            if (ratio <= 1.3 && ratio > 1.1){
                return {ratio: 'height-ratio-050', value: ratio}
            }
            if (ratio <= 1.1 && ratio > 0.8){
                return {ratio: 'height-ratio-075', value: ratio}
            }
            if (ratio <= 0.8){
                return {ratio: 'height-ratio-100', value: ratio}
            }
        }

        return getDimension(size)
    }

    const returnColAmount = ()=>{
        if (oneCol){return 'oneCol'}
        if (threeCol){return 'threeCol'}
        if (FourCol){return 'fourCol'}

        else return 'fiveCol'
    }

    const articleRows = ()=>{ // currently only shows full rows. In future, how to automatically fill gap if there's four elements
    //    console.log(pageContent.articles.length)
        if(pageContent.articles.length < 1) {return []}

        if(returnColAmount() == 'fiveCol'){
            let rows = []
            let c = 0;
            let singleRow = [];
            for (var i=0;pageContent.articles.length > i; i++){
                c = c+1
                singleRow.push(pageContent.articles[i]);

                if(c == 5 || c == pageContent.articles.length){ // if results fewer than width suggestion
                    rows.push([...singleRow])
                    c=0;
                    singleRow = []
                }
            }
            return rows;
        }
        if(returnColAmount() == 'fourCol'){
            // console.log('fourCol')
            let rows = []
            let c = 0;
            let singleRow = [];
            for (var i=0;pageContent.articles.length > i; i++){
                // console.log(pageContent.articles.blocks[i].block.doubleWidth)

                // if (pageContent.articles[i].doubleWidth !== false && pageContent.articles[i].doubleWidth == 'Double column') {
                //     // console.log('double')
                //     if(c <= 2){ // check if row can still fit a double width
                //         // console.log('smaller than 3', c)
                //         c = c+2
                //     }else{ // otherwise push row, leaving a blank gap
                //         // console.log('higher than 3', c)
                //         rows.push([...singleRow])
                //         c=0;
                //         singleRow = []
                //     }
                // }
                // else{
                    // console.log('single')
                    c = c+1
                // }

                // console.log('pushing row', c)
                singleRow.push(pageContent.articles[i]);

                if(c == 4 || c == pageContent.articles.length){
                    // console.log('equal to 5', c)
                    rows.push([...singleRow])
                    c=0;
                    singleRow = []
                }
            }
            return rows;
        }
        if(returnColAmount() == 'threeCol'){
            let rows = []
            let c = 0;
            let singleRow = [];
            for (var i=0;pageContent.articles.length > i; i++){
                // console.log(pageContent.articles.blocks[i].block.doubleWidth)

                // if (pageContent.articles[i].doubleWidth !== false && pageContent.articles[i].doubleWidth == 'Double column') {
                //     // console.log('double')
                //     if(c <= 1){ // check if row can still fit a double width
                //         // console.log('smaller than 3', c)
                //         c = c+2
                //     }else{ // otherwise push row, leaving a blank gap
                //         // console.log('higher than 3', c)
                //         rows.push([...singleRow])
                //         c=0;
                //         singleRow = []
                //     }
                // }
                // else{
                    // console.log('single')
                    c = c+1
                // }

                // console.log('pushing row', c)
                singleRow.push(pageContent.articles[i]);

                if(c == 3 || c == pageContent.articles.length){
                    // console.log('equal to 5', c)
                    rows.push([...singleRow])
                    c=0;
                    singleRow = []
                }
            }
            return rows;
        }
        if(returnColAmount() == 'oneCol'){
            let rows = []
            let singleRow = [];
            for (var i=0;pageContent.articles.length > i; i++){

                //singleRow.push(pageContent.articles.blocks[i]);
                rows.push([pageContent.articles[i]])
                //singleRow=[]

            }
            return rows;
        }
    }

    const insertSpace = (searchInput)=>{
        return searchInput.replaceAll('%20', ' ')
    }

    // console.log(pageContent)
    if(!pageContent) return <></>
    return(
        <div className={`collection-page ${returnColAmount()}`}>
            
            {!isNarrow ?
                <Menu/>
                :
                <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
            }
            <div className={`collection-page-content-wrapper`} style={{opacity: menuOpen ? 0 : 1}}>
                
                <div className="page-navigation-wrapper">
                    <div className="page-navigation-title" onClick={()=>{pageNavigationHandler(false)}}>
                        Search
                    </div>
                    <div className="page-navigation-option">
                        {/* <form> */}
                            <span className="page-navigation-separator">/</span>
                            <input
                                type="text"
                                placeholder={insertSpace(searchInput)}
                                id="search-field"
                                name="search-field"
                                style={{width: 40 + returnSearchInputWidth(searchInput, "36px 'Suisse Medium'")}}
                                className="page-navigation-search-field-input"
                                onChange={(e)=>{setSearchInput(e.target.value)}}
                                onKeyPress={(e)=>{searchFieldHandler(e)}} />
                            {/* <input type="button" name="go" value="Submit" onSubmit={()=>{submitSearchHandler()}}/> */}
                        {/* </form> */}
                    </div>
                    {/* {inputActive ? 
                        <div className="page-navigation-option" onClick={()=>{pageNavigationHandler(activeTag)}}>
                            <span className="page-navigation-separator">/</span>
                            <span className={'active-tag'}>{activeTag}</span>
                            <div className="search-cross">
                                <GrClose/>
                            </div>
                        </div>

                    :
                    <div className="page-navigation-search-input">
                        <input type="text" placeholder={searchInput} id="search-field" name="search-field" className="search-field-input" onChange={(e)=>{setSearchInput(e.target.value)}} onSubmit={()=>{submitSearchHandler()}}/>
                        <div className="page-navigation-search-input-button" onClick={()=>{pageNavigationHandler('search')}}>
                            <BiSearch/>
                        </div>
                    </div>
                    } */}
  
 
                </div>
                <div className="collection-page-article-section">
                    {/* {console.log(articleRows())} */}
                {articleRows().length > 0 ? articleRows().map((row, index)=>{
                        return (
                            <div key={'r'+index} className="collection-page-article-row">
                            {/* <FadeInSection > */}
                            {/* {console.log(row)} */}
                            {row.map((article, index) =>{
                                // console.log(article)
                                let imageHeight = {ratio: 'height-ratio-100', value: 1}
                                
                                // console.log(article)
                                if (article.highlightItem.asset._type == 'sanity.imageAsset'){
                                    imageHeight = returnImageHeight(article.highlightItem.asset._id)
                                } else{
                                    imageHeight = {ratio: 'height-ratio-025', value: 1}
                                }
                                // console.log(imageHeight)
                            return (
                                <FadeInSection key={article._id}>
                            <div className={`collection-page-article single-width`} >
                                {/* {console.log(article)} */}
                                <a href={'slug' in article ? '/' + article.slug.current : article.url}>
                              
                                    <div className={`collection-page-article-image ${!oneCol ? imageHeight.ratio : 'height-ratio-100' }`}>
                                    {/* {console.log(article)} */}
                                        {'highlightItem' in article ? 

                                            article.highlightItem.asset._type == 'sanity.imageAsset' ?
                                                
                                                <img src={urlFor(article.highlightItem.asset._id).width(singleWidthImage).url()}/>
                                            :

                                            <div className="video-thumbnail-wrapper">
                                                {console.log(article)}
                                                <div className="video-play-button">
                                                    <BiPlay/>
                                                </div>
                                                {'thumbnail' in article ?
                                                    <img src={ urlFor(article.thumbnail.asset).width(singleWidthImage).url()}/> 
                                                :
                                                    <img src={`https://image.mux.com/${article.highlightItem.asset.playbackId}/thumbnail.jpg?width=${singleWidthImage}`}/>
                                                }
                                            </div>
                                            :
                                            ''
                                        }
                                    </div>
                                    
                                
                                <div className="collection-page-article-label">
                                    <div className="collection-page-article-title">
                                        {/* {console.log(article.block)} */}
                                        {/* onClick={()=>navigate(article.block._type == 'article' ? 'anicka-yi-sculpting-the-air' : article.block._type == 'video' ? 'maximilianprfer-inwelt-gallery-kandlhofer' : '' )} */}
                                        {article._type !== 'ad' ? returnFormattedTitle(article.title) : ''}
                                    </div>
                                    <div className="collection-page-article-byline">
                                        {/* {article.block.highlightImage.asset._ref}, {imageHeight.ratio}, {imageHeight.value} */}
                                        {article.author.length > 0 ? article.author[0].title : ''}
                                        {article._type == 'event' && article.eventData[0].place !== undefined ? article.eventData[0].place[0].label : ''}
                                        {/* {Object.keys(article.block.eventData).length === 0 ? '' : article.block.eventData.place[0].label} */}
                                        {/* {console.log(article.block.eventData)} */}
                                    </div>
                                </div>
                                </a>
                            </div>
                            </FadeInSection>
                            )
                        })}
                        {/* </FadeInSection> */}
                        </div>
                        )
                    })
                
                    :
                    <div className="no-results">
                        Sorry, no results
                        </div>
                }
                </div>
            </div>
            <Footer type={'general'}/> 
        </div>
    )
}

export default SearchPage