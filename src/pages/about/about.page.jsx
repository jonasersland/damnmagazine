import React, {useEffect, useState,useContext} from "react";
import sanityClient from "../../client.js";
import './about.styles.scss'
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

const About = ()=>{

    const isNarrow = useMediaQuery({ query: '(max-width: 1100px)' })
    const [menuOpen, setMenuOpen] = useState(false);
    const [pageContent, setPageContent] = useState(null)

    const {setTitleHandler} = useContext(GlobalContext);
    setTitleHandler(`DAMN Magazine - About`)

    useEffect(() =>{ 
        let fetchContentQuery = `*[_id == "about"]{...}[0]`
        sanityClient
        .fetch(fetchContentQuery)
        .then(data => {setPageContent(data)})
        .catch(console.error)
    },[]);


    const aboutTextComponents = {
        marks: {
          link: ({children, value}) => {
            const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
            return (
              <a href={value.href} target="_blank" rel={rel}>
                {children}
              </a>
            )
          },
        },
      }

    if(!pageContent) return <></>
    return(
        <div className="about">
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
                        <a href='/mediakit'>
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
                <div className='about-content-wrapper'>
                <div className='about-image'>
                    {'image' in pageContent ?
                      <img src={urlFor(pageContent.image).url()}/>
                      :
                      ''
                    }
                   
                </div>
                <div className="about-text">
                    <PortableText
                        value={pageContent.text}
                    />

                    <div className="about-bottom-text">
                        <PortableText
                            value={pageContent.bottomtext}
                            components={aboutTextComponents}
                        />
                    </div>
                </div>
            </div>

            <Footer type={'general'}/> 

        </div>
    )
}

export default About