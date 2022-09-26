import React, {useEffect, useState, useContext} from "react";
import './popup.styles.scss'

import sanityClient from "../../client.js";
import {PortableText} from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'

import NewsletterSubscribe from '../newsletter-subscribe/newsletter-subscribe.component'

import {GrClose} from 'react-icons/gr'

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}

const Popup =({popupCloseHandler})=>{
    const [popupContent, setPopupContent] = useState(null)
    const [newsletterExpanded, setNewsletterExpanded] = useState(null)
    const [newsletterSent, setNewsletterSent] = useState(false)

    useEffect(() =>{
        let fetchContentQuery = `*[_type == 'frontpage']{popup}[0]`
        sanityClient
        .fetch(fetchContentQuery)
        .then(data => {setPopupContent(data)})
        .catch(console.error)
    },[]);

    const submitNewsletter = ()=>{
        setNewsletterSent(true)
    }

    // console.log(popupContent)
    if (!popupContent) return <></>
    return (
        <div className="popup-wrapper">
            <div className="popup-image">
                <img src={urlFor(popupContent.popup.image).url()}/>
            </div>
            <div className="popup-content theme-color-text">

                    <div className="popup-close" onClick={()=>{popupCloseHandler()}}>
                        <GrClose/>
                    </div>

                    <div className={`popup-text ${newsletterExpanded ? '' : 'display'}`}>

                        <PortableText value={popupContent.popup.text}/>

                        <div className="popup-bottom">
                            <a target='_blank' href='https://www.bruil.info/product/damn/'><div>SUBSCRIBE TO DAMN°<br/></div></a>
                            {/* <div onClick={()=>{setNewsletterExpanded(true)}}>SIGN UP TO NEWSLETTER</div> */}
                        </div>

                    </div>

                    <div className={`popup-newsletter-expanded ${newsletterExpanded ? 'display' : ''}`}>
                        <NewsletterSubscribe/>
                        {/* <div className="newsletter-title">NEWSLETTER</div>
                        <input type="text" placeholder='Email' id="email" name="email" className="popup-email-form popup-item" />
                        <input type="text" placeholder='First name' id="fname" name="fname" className="popup-email-form popup-item" />
                        <input type="text" placeholder='Last name' id="lname" name="lname" className="popup-email-form popup-item" />
                        
                        <div className="popup-email-submit-wrapper">
                            <div className="popup-email-opt-wrapper">
                                <div className="popup-email-opt-tick-wrapper">
                                    <input type="checkbox" />
                                </div>
                                <div className="popup-email-opt-label">Yes, I would like to opt-in to this mailing list</div>
                            </div>
                            <div className="popup-email-submit popup-item" onClick={()=>submitNewsletter()}>
                                {newsletterSent ? 'THANKS FOR SIGNING UP!': 'SIGN UP'}
                            </div>
                        </div> */}
                    </div>
            </div>
        </div>
    )
}

export default Popup