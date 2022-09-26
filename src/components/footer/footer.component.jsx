import React, {useEffect, useState, useRef} from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import sanityClient from "../../client.js";
import './footer.styles.scss'
import imageUrlBuilder from '@sanity/image-url'
import { useMediaQuery } from 'react-responsive'

import {returnImageHeight } from "../../utils/utils.js";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}

const Footer = ({type})=>{

    // console.log(type)

    const [pageContent, setPageContent] = useState(null)
    const navigate = useNavigate();

    const FourCol = useMediaQuery({ query: '(max-width: 1200px)' })
    const threeCol = useMediaQuery({ query: '(max-width: 700px)' })
    const oneCol = useMediaQuery({ query: '(max-width: 540px)' })
    const isNarrow = useMediaQuery({ query: '(max-width: 1100px)' })

    const returnQuery = (type)=>{
        switch (type){
            case 'article': return 'article'
            break;
            case 'researchreality': return 'researchreality'
            break;
            case 'event': return 'event'
            break;
        }
    }

    const returnQueryAmount =()=>{
        let random = Math.floor(Math.random() * 11);
        if (oneCol){return `${random}...${random + 3}`}
        if (threeCol){return `${random}...${random + 2}`}
        else return `${random}...${random + 3}`
    }

    const returnColAmount = ()=>{
        if (oneCol){return 'oneCol'}
        if (threeCol){return 'threeCol'}
        if (FourCol){return 'fourCol'}

        else return 'fiveCol'
    }

    useEffect(() =>{ 
        let fetchContentQuery = `{'articles': *[_type == '${returnQuery(type)}']{_id, _type, slug, title, highlightItem[]{'asset':asset->, ...},'author':*[_id == ^.author._ref]{title}}[${returnQueryAmount()}] | order(_createdAt asc)}`
        sanityClient
        .fetch(fetchContentQuery)
        .then(data => {setPageContent(data)})
        .catch(console.error)
    },[]);

    const ArticleFooter = ()=>{
        // console.log(pageContent.articles)
        return(<>
            {pageContent.articles.map((article,index)=>{
                // console.log(article)
                if (article.highlightItem[0]._type == 'highlightImage') {
                    let imageHeight = returnImageHeight(article.highlightItem[0].asset._id)
                    // console.log(article.highlightItem[0])
                    // if(imageHeight == 'undefined'){
                    //     console.log(article.highlightItem[0])
                    // }
                    return(
                        <div key={'footer' + index} className={`footer-article`} >
                            <a href={`/${article.slug.current}`}>
                                <div className={`footer-article-image ${imageHeight.ratio}`}>
                                    <img src={urlFor(article.highlightItem[0]).width(500).url()}/>
                                </div>
                                <div className="footer-article-label">
                                    <div className="footer-article-title">
                                        {article.title}
                                    </div>
                                    <div className="footer-article-byline">
                                        {article.author.length > 0 ? article.author[0].title : ''}
                                    </div>
                                </div>
                            </a>
                    </div>
                    )
                } else if (article.highlightItem[0]._type == 'highlightVideo') {
                    // let imageHeight = {'height-ratio-100'}
                    // console.log('video footer')
                    return(
                        <div key={'footer' + index} className={`footer-article`} >
                            <a href={`/${article.slug.current}`}>
                                <div className={`footer-article-image height-ratio-025`}>
                                
                                    {'thumbnail' in article ?
                                        <img src={ urlFor(article.thumbnail.asset).width(window.innerWidth/2).url()}/> 
                                    :
                                        <img src={`https://image.mux.com/${article.highlightItem[0].asset.playbackId}/thumbnail.jpg?width=${window.innerWidth/2}`}/>
                                    }         
                                    {/* <img src={`https://image.mux.com/${article.highlightItem[0].asset.playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth/2}`}/> */}
                                </div>
                                <div className="footer-article-label">
                                    <div className="footer-article-title">
                                        {article.title}
                                    </div>
                                    <div className="footer-article-byline">
                                        {article.author.length > 0 ? article.author[0].title : ''}
                                    </div>
                                </div>
                            </a>
                    </div>
                    )
                }
            })
            }

            <div className="footer-contact">
            © 2022 DAMN° Magazine. All rights reserved. <span className="footer-links"><a href={'/privacy-policy'}>Privacy</a> | <a href={'/terms-conditions'}>Terms & Conditions</a> | <a href={'/contact'}>Contact Us</a></span>
            </div>
        </>)
    }

    const ArticleFooterMobile = ()=>{
        return(<>
                    <Swiper
                        slidesPerView={"auto"}
                        spaceBetween={0}
                        loop={true}
                        className="mySwiper"
                        autoHeight={true}
                        // autoWidth={true}
                        // centeredSlides={true}
                    >
            {pageContent.articles.map((article,index)=>{
                if (article.highlightItem[0]._type == 'highlightImage') {
            let imageHeight = returnImageHeight(article.highlightItem[0].asset._id)
                return(
                    <SwiperSlide> 
                    <div key={'footer' + index} className={`footer-article`}>
                        <a href={`/${article.slug.current}`}>
                            <div className={`footer-article-image ${imageHeight.ratio}`}>
                                <img src={urlFor(article.highlightItem[0].asset).width(500).url()}/>
                            </div>
                            <div className="footer-article-label">
                                <div className="footer-article-title">
                                    {article.title}
                                </div>
                                <div className="footer-article-byline">
                                    {article.author.length > 0 ? article.author[0].title : ''}
                                </div>
                            </div>
                        </a>
                    </div>
                    </SwiperSlide> 
                )}else if (article.highlightItem[0]._type == 'highlightVideo') {
                    let imageHeight = 'height-ratio-025'
                    return(
                        <SwiperSlide> 
                        <div key={'footer' + index} className={`footer-article`}>
                            <a href={`/${article.slug.current}`}>
                                <div className={`footer-article-image ${imageHeight}`}>
                                     {'thumbnail' in article ?
                                        <img src={ urlFor(article.thumbnail.asset).width(window.innerWidth).url()}/> 
                                    :
                                        <img src={`https://image.mux.com/${article.highlightItem[0].asset.playbackId}/thumbnail.jpg?width=${window.innerWidth}`}/>
                                    } 
                                    {/* <img src={`https://image.mux.com/${article.highlightItem[0].playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`}/> */}
                                </div>
                                <div className="footer-article-label">
                                    <div className="footer-article-title">
                                        {article.title}
                                    </div>
                                    <div className="footer-article-byline">
                                        {article.author.length > 0 ? article.author[0].title : ''}
                                    </div>
                                </div>
                            </a>
                        </div>
                        </SwiperSlide> 
                    )
                }
            })
            }
            </Swiper>

            <div className="footer-contact">
            © 2022 DAMN° Magazine. All rights reserved. <span className="footer-links"><a href={'/privacy-policy'}>Privacy</a> | <a href={'/terms-conditions'}>Terms & Conditions</a> | <a href={'/contact'}>Contact Us</a></span>
            </div>
        </>)
    }

    

    const GeneralFooter = ()=>{

        return(
            <div className="footer-contact">
            © 2022 DAMN° Magazine. All rights reserved. <span className="footer-links"><a href={'/privacy-policy'}>Privacy</a> | <a href={'/terms-conditions'}>Terms & Conditions</a> | <a href={'/contact'}>Contact Us</a></span>
            </div>
        )
    }

    // console.log(type)
    // console.log(pageContent)
    if(!pageContent) return <></>
    return (
        <div className={`footer ${returnColAmount()}`}>
            {type == 'article' || type == 'researchreality' || type == 'event' ? oneCol ? <ArticleFooterMobile/> : <ArticleFooter/> : ''}
            {type == 'general' ? <GeneralFooter/>: ''}
        </div>
    )

}
export default Footer