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

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}

const FeaturesPage = ({tags})=>{

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
    const [query, setQuery] = useState(null) 
    const [activeTag, setActiveTag] = useState('')

    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const {setTitleHandler} = useContext(GlobalContext);
    setTitleHandler('DAMN Magazine - Features')

    useEffect(()=>{
        // console.log(location.pathname)
        if(location.pathname.includes('/features/')){
                let currentLocation = location.pathname.replace('/features/','');
                // console.log(currentLocation) 
                if (!currentLocation){
                    setQuery(`{'articles': *[_type == 'article']{_id,originallyPublished, _createdAt, _type, slug, title,thumbnail, doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}} | order(_createdAt desc) | order(originallyPublished desc)}`)
                } else{
                    let optionCap = currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1);
                    // console.log(optionCap);
                    setQuery(`{'articles': *[_type == 'article' && "${optionCap}" in tags[].label] {_id,originallyPublished,_createdAt, _type, slug, title,thumbnail,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}} | order(_createdAt desc) | order(originallyPublished desc)}`)
                    setActiveTag(optionCap)
                }
            }else{
                setQuery(`{'articles': *[_type == 'article']{_id,originallyPublished, _createdAt, _type, slug, title,thumbnail, doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}} | order(_createdAt desc) | order(originallyPublished desc)}`)
            }
    },[location])

    useEffect(() =>{ 
        if(!query) return
        sanityClient
        .fetch(query)
        .then(data => {setPageContent(data)})
        .catch(console.error)
    },[query]);

    const pageNavigationHandler = (option)=>{
        
        if (!option){
            setActiveTag(null)
            navigate(`/features/`)
            // setQuery(`{'articles': *[_type == 'article'] {_id,originallyPublished,_createdAt, _type, slug, title,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}} | order(_createdAt desc) | order(originallyPublished desc)}`) 
            // setActiveTag('')
        }else{
            let optionCap = option.charAt(0).toUpperCase() + option.slice(1);
            navigate(`/features/${optionCap}`)
        }
        // setQuery(`{'articles': *[_type == 'article' && "${optionCap}" in tags[].label] {_id,originallyPublished,_createdAt, _type, slug, title,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}} | order(_createdAt desc) | order(originallyPublished desc)}`) 
        // setActiveTag(option)
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
                        Features
                    </div>
                    {/* {console.log(queryFilter.tags)} */}
                    {tags.length > 1 ?
                    tags.map((option, index)=>{
                        return (
                        <div key={'o'+index} className="page-navigation-option" onClick={()=>{pageNavigationHandler(option)}}>
                            <span className="page-navigation-separator">/</span>
                            <span className={activeTag == option ? 'active-tag': ''}>{option}</span>
                        </div>
                            )
                    })
                    :
                    ''
                    }
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
                                    {console.log(article)}
                                        {'highlightItem' in article ? 

                                            article.highlightItem.asset._type == 'sanity.imageAsset' ?
                                                
                                                <img src={urlFor(article.highlightItem.asset._id).width(singleWidthImage).url()}/>
                                            :

                                            <div className="video-thumbnail-wrapper">
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

export default FeaturesPage