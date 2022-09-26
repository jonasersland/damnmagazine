import React, {useEffect, useState,useContext} from "react";
import sanityClient from "../../client.js";
import './advertise.styles.scss'
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import Footer from "../../components/footer/footer.component";
import {PortableText} from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { useMediaQuery } from 'react-responsive'
import { GlobalContext } from "../../context/global-context"

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}

const Advertise = ()=>{

    const isNarrow = useMediaQuery({ query: '(max-width: 1100px)' })
    const [menuOpen, setMenuOpen] = useState(false);
    const [pageContent, setPageContent] = useState(null)

    const {setTitleHandler} = useContext(GlobalContext);
    setTitleHandler(`DAMN Magazine - Advertise`)

    useEffect(() =>{ 
        let fetchContentQuery = `*[_id == "advertise"]{...}[0]`
        sanityClient
        .fetch(fetchContentQuery)
        .then(data => {setPageContent(data)})
        .catch(console.error)
    },[]);

    console.log(pageContent)
    if(!pageContent) return <></>
    return(
        <div className="advertise">
            {!isNarrow ?
                <Menu/>
                :
                <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
            }
                <div className="page-navigation-wrapper top-margin">
                    <div className="page-navigation-option">
                        <a href='/about' className='active-tag'>
                            ABOUT
                        </a>
                    </div>
                    <div className="page-navigation-option" >
                        <span className="page-navigation-separator">/</span>
                        <a href='/archive'>
                        BACK ISSUES
                        </a>
                    </div>
                    <div className="page-navigation-option" >
                        <span className="page-navigation-separator">/</span>
                        <a href='/mediakit' className='active-tag'>
                            MEDIA KIT
                        </a>
                    </div>
                    <div className="page-navigation-option" >
                        <span className="page-navigation-separator">/</span>
                        <a href='/contact'>
                            CONTACT
                        </a>
                    </div>
                </div>
            <div className='advertise-content-wrapper'>
                <div className="advertise-title">
                    {pageContent.title}
                </div>
                <div className='advertise-image'>
                    {'image' in pageContent ?
                    <img src={urlFor(pageContent.image).url()}/>
                    :
                    ''
                    }
                    
                </div>
                <div className="advertise-text">
                    <PortableText
                        value={pageContent.text}
                    />

                    <div className="advertise-bottom-text">
                        <div className="bottom-text-title">
                        {pageContent.bottomtext}
                        </div>
                       
                        {pageContent.contactArray.map(contact =>{
                            return(<div key={contact._key} className="bottom-text-contact">
                                    <PortableText
                                        value={contact.contact}
                                    />
                            </div>)
                        })}
                    </div>
                </div>
            </div>

            <Footer type={'general'}/> 

        </div>
    )
}

export default Advertise