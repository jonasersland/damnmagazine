import React, {useEffect, useState, useRef, useContext} from "react";
import './fullscreenImageDisplay.styles.scss'

import sanityClient from "../../client.js";
import imageUrlBuilder from '@sanity/image-url'
import {PortableText} from '@portabletext/react'
import {getImageDimensions} from '@sanity/asset-utils'


const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}

const FullscreenImageDisplay = ({fullscreenImage, setFullscreenImage})=>{
    console.log(fullscreenImage)

    const aspect = fullscreenImage ? getImageDimensions(fullscreenImage.imageId).aspectRatio : 0; 
    const [imageShowing, setImageShowing] = useState(false)

    useEffect(()=>{
        if(fullscreenImage){
            setImageShowing(true)
        }else{
            setImageShowing(false)
        }
    },[fullscreenImage])

    if (!fullscreenImage) return <></>
    return (
        <div className={`fullscreen-image-wrapper`} onClick={()=>{setFullscreenImage(null)}}>
            <div className={`fullscreen-content ${imageShowing ? 'display' : ''}`}>
                <div className="fullscreen-image">
                    <img src={urlFor(fullscreenImage.imageId).height(window.innerHeight).url()}/>
                </div>
                {'caption' in fullscreenImage ?
                        <span className="fullscreen-caption" style={{width: (window.innerHeight - 130) * aspect}}>
                            <PortableText
                                value={fullscreenImage.caption}
                            />
                        </span>
                    :''    
                }
            </div>
            <div className="fullscreen-image-background">
            </div>
        </div>
    )
}

export default FullscreenImageDisplay