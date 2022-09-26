import React, {useEffect, useState, useRef, useContext} from "react";
import sanityClient from "../../../client.js";
import './singleIssueBlock.styles.scss'

import {PortableText} from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'

import { Navigation, Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { GlobalContext } from "../../../context/global-context"
import SlideshowCursor from "../../../components/slideshowCursor/slideshowCursor.component";

import FullscreenImageDisplay from "../../../components/fullscreen-image-display/fullscreenImageDisplay.component";

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}

const SingleIssueBlock =({isNarrow, content})=>{

    const windowImageHeight = Math.round(window.innerHeight * 0.7);
    const [fullscreenImage, setFullscreenImage] = useState(null)

    const { cursorType, cursorChangeHandler } = useContext(GlobalContext);
    const navigationPrevRef = useRef(null)
    const navigationNextRef = useRef(null)

    const returnImageWidth = (asset)=>{

        if (isNarrow) return window.innerWidth - 40

        // gange vindushøyden med ratio, så får du riktig bredde
        const string = asset.split("-");
        const size = string[2].split("x");
        
        const getDimension =(size)=>{
            let ratio = size[0] / size[1];
            let newWidth = windowImageHeight * ratio
            return newWidth;
        }
        return getDimension(size)
    }
    // console.log(content)
    if(!content) return <></>
    return(
        <div className="single-issue-block">
            <FullscreenImageDisplay fullscreenImage={fullscreenImage} setFullscreenImage={setFullscreenImage}/>
            <SlideshowCursor/>
            <div className="issue-title">
                DAMN {content.number}: {content.title}
            </div>
             <div className="issue-images">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = navigationPrevRef.current;
                        swiper.params.navigation.nextEl = navigationNextRef.current;
                    }}        
                    slidesPerView={"auto"}
                    spaceBetween={0}
                    loop={true}
                    className="mySwiper"
                    autoHeight={true}
                >
                    <div
                        className="swiper-ref-prev"
                        ref={navigationPrevRef}
                        onMouseEnter={() => cursorChangeHandler("previous")}
                        onMouseLeave={() => cursorChangeHandler("")}
                    />
                    <div
                        className="swiper-ref-next"
                        ref={navigationNextRef}
                        onMouseEnter={() => cursorChangeHandler("next")}
                        onMouseLeave={() => cursorChangeHandler("")}    
                    />
                            <SwiperSlide style={{width:returnImageWidth(content.coverImage.asset._ref)}}> 
                                <div className="issue-image-slider-wrapper">
                                    {/* <FullscreenImage> */}
                                        <img src={urlFor(content.coverImage).height(windowImageHeight).url()} onClick={()=>{setFullscreenImage({imageId:content.coverImage})}}/>
                                    {/* </FullscreenImage> */}
                                </div>
                            </SwiperSlide>
                    {content.images.map((image, index)=>{                            
                        return (
                            <SwiperSlide key={index} style={{width:returnImageWidth(image.asset._ref)}}> 
                                <div className="issue-image-slider-wrapper">
                                    {/* <FullscreenImage> */}
                                        <img src={urlFor(image).height(windowImageHeight).url()} onClick={()=>{setFullscreenImage({imageId:image})}}/>
                                    {/* </FullscreenImage> */}
                                </div>
                            </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
            <div className="issue-text">
                <PortableText
                    value={content.text}
                />
                <div className="issue-extra">
                    <div className="issue-more">MORE FROM DAMN{content.number}</div>
                <a target='_blank' href={content.url}><div className="issue-buy">Buy issue<br/>€15 (Europe) / €21 (Rest of the world)</div></a>
            </div>
            </div>
           
    </div>
    )
}

export default SingleIssueBlock