import React, { useEffect, useState, useContext } from "react";
import "./popup.styles.scss";

import sanityClient from "../../client.js";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";

import NewsletterSubscribe from "../newsletter-subscribe/newsletter-subscribe.component";

import { GrClose } from "react-icons/gr";

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

const Popup = ({ popupCloseHandler }) => {
  const [popupContent, setPopupContent] = useState(null);
  const [newsletterExpanded, setNewsletterExpanded] = useState(null);
  const [newsletterSent, setNewsletterSent] = useState(false);

  useEffect(() => {
    let isMounted = true;

    let fetchContentQuery = `*[_type == 'frontpage']{popupArray}[0]`;
    sanityClient
      .fetch(fetchContentQuery)
      .then((data) => {
        if (isMounted) {
          let currentPopupData = { hide: false };
          if (data.popupArray[0].chosenPopup == "firstPopup") {
            currentPopupData.image = data.popupArray[0].firstPopup.image;
            currentPopupData.text = data.popupArray[0].firstPopup.text;
            if ("links" in data.popupArray[0].firstPopup) {
              currentPopupData.links = data.popupArray[0].firstPopup.links;
            }
          }
          if (data.popupArray[0].chosenPopup == "secondPopup") {
            currentPopupData.image = data.popupArray[0].secondPopup.image;
            currentPopupData.text = data.popupArray[0].secondPopup.text;
            if ("links" in data.popupArray[0].secondPopup) {
              currentPopupData.links = data.popupArray[0].secondPopup.links;
            }
          }
          if (data.popupArray[0].chosenPopup == "thirdPopup") {
            currentPopupData.image = data.popupArray[0].thirdPopup.image;
            currentPopupData.text = data.popupArray[0].thirdPopup.text;
            if ("links" in data.popupArray[0].thirdPopup) {
              currentPopupData.links = data.popupArray[0].thirdPopup.links;
            }
          }
          if (data.popupArray[0].chosenPopup == "noPopup") {
            currentPopupData.hide = true;
          }
          setPopupContent(currentPopupData);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  const returnLinks = () => {
    if ("links" in popupContent) {
      return popupContent.links.map((link, index) => {
        return (
          <a target="_blank" key={`popupLink-${index}`} href={link.urlString}>
            <div>{link.urlTitle}</div>
          </a>
        );
      });
    } else {
      return <></>;
    }
  };
  if (!popupContent || popupContent.hide == true) return <></>;

  return (
    <div className="popup-wrapper">
      <div className="popup-image">
        <img src={urlFor(popupContent.image).url()} />
      </div>
      <div className="popup-content theme-color-text">
        <div
          className="popup-close"
          onClick={() => {
            popupCloseHandler();
          }}
        >
          <GrClose />
        </div>

        <div className={`popup-text ${newsletterExpanded ? "" : "display"}`}>
          <PortableText value={popupContent.text} />

          <div className="popup-bottom">
            {returnLinks()}
            {/* <a target='_blank' href='https://www.bruil.info/product/damn/'><div>SUBSCRIBE TO DAMN°<br/></div></a> */}
            {/* <a href='https://damnmagazine.net/newsletter'><div>SIGN UP TO NEWSLETTER<br/></div></a> */}

            {/* <div onClick={()=>{setNewsletterExpanded(true)}}>SIGN UP TO NEWSLETTER</div> */}
          </div>
        </div>

        <div
          className={`popup-newsletter-expanded ${
            newsletterExpanded ? "display" : ""
          }`}
        >
          {/* <NewsletterSubscribe/> */}
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
  );
};

export default Popup;
