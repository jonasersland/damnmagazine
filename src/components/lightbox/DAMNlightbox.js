import React, { useState, useEffect,useRef } from 'react';
import sanityClient from "../../client.js";
import './DAMNlightbox.styles.scss'
import { Navigation, Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {PortableText} from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'

import {GrClose} from 'react-icons/gr'
import {BiArrowBack} from 'react-icons/bi'
import {BiArrowForward} from 'react-icons/bi'

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}


const DAMNlightbox = ({images, currentImage, setCurrentImage}) => {

    console.log(images, currentImage)
    const [currentImageIndex, setCurrentIndex] = useState(null);
    const navigationPrevRef = useRef()
    const navigationNextRef = useRef()
    

    const textComponents = {
        marks: {
            em:({children})=>{
                return (<em>{children}</em>)
            },
            strong:({children})=>{
                return (<strong>{children}</strong>)
            },
        },
      }

    useEffect(()=>{
        // console.log(images, currentImage)
        let currentImageId;
        let currentImageIndex;
        if ('_id' in currentImage.asset){
            currentImageId = currentImage.asset._id
        } else{
            currentImageId = currentImage.asset._ref
        }
        images.map((image, index)=>{
            let imageId;
            if ('_id' in image.asset){
                imageId = image.asset._id
            } else{
                imageId = image.asset._ref
            }
            if (currentImageId == imageId){
                // console.log('found')
                currentImageIndex = index
            }
        })
        setCurrentIndex(currentImageIndex)
        // console.log(currentImageIndex)

    },[])
        if (!images.length) return
    return (
        <div className='fullscreen-swiper-wrapper'>
        <div className='fullscreen-close' onClick={()=>setCurrentImage(null)}><GrClose/></div>
        <div className="fullscreen-arrow-prev" ref={navigationPrevRef}><span><BiArrowBack/></span></div>
        <div className="fullscreen-arrow-next" ref={navigationNextRef}><span><BiArrowBack/></span></div>
        {currentImageIndex !== null ?
        <Swiper
        initialSlide={currentImageIndex}
        modules={[Navigation]}
        navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
        }}
        slidesPerView={1}
        loop={true}
        className="fullscreenSwiper"
        autoHeight={true}
        >
            {/* {console.log(images)}
            {console.log(images.img)} */}

            {images.map((image, index)=>{
               return(
               <SwiperSlide key={'FSslide' + index}>
                   <div className="fullscreen-image-slider-outer-wrapper" onClick={()=>setCurrentImage(null)}>
                    <div className="fullscreen-image-slider-wrapper">
                            <img src={urlFor(image.asset).width(window.innerWidth).url()}/>
                        </div>
                    <div className="fullscreen-image-slider-caption" >
                        
                        <PortableText
                            value={image.caption}
                            components={textComponents}
                        />
                    </div>
                    </div>
                </SwiperSlide>
               )
            })}

        </Swiper>
        :''}
        <div className='fullscreen-background' onClick={()=>setCurrentImage(null)}></div>
        </div>
    );
};

export default DAMNlightbox;