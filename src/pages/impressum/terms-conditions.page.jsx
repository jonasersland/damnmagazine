import React, {useEffect, useState,useContext} from "react";
import sanityClient from "../../client.js";
import './impressum.styles.scss'
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import Footer from "../../components/footer/footer.component";
import {PortableText} from '@portabletext/react'
import { useMediaQuery } from 'react-responsive'
import { GlobalContext } from "../../context/global-context"

const TermsConditions = ()=>{

    const isNarrow = useMediaQuery({ query: '(max-width: 1100px)' })
    const [menuOpen, setMenuOpen] = useState(false);
    const [pageContent, setPageContent] = useState(null)
    const {setTitleHandler} = useContext(GlobalContext);
    

    useEffect(() =>{ 
        let fetchContentQuery = `*[_id == "settings"]{termsConditionsText}`
        sanityClient
        .fetch(fetchContentQuery)
        .then(data => {setPageContent(data)})
        .catch(console.error)
        setTitleHandler('DAMN Magazine - Terms and Conditions')
    },[]);

    const textComponents = {
        marks: {
            link: (props) => {

                if(props.value.href.includes('@')){
                    return <a href={'mailto:'+props.value.href}>{props.children}</a>
                }else{
                    return <a href={props.value.href} target="_blank" rel="noopener">{props.children}</a>
                }
              
            }
          },
          types: {
            image: ({value}) => <img src={value.imageUrl} />,
            quote: ({value}) => {
            return(
              <div className="content-quote-wrapper">
                  <span className="content-quote">
                  &ldquo;<PortableText
                          value={value.content}
                      />&rdquo;
                  </span>
                  <span className="content-quote-person">
                      &#8212; {value.quotePerson}
                  </span>
              </div>
            )
            },
        }
    }
    console.log(pageContent)
    if(!pageContent) return <></>
    return(
        <div className="terms-conditions">
            {!isNarrow ?
                <Menu/>
                :
                <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
            }
            <div className="page-navigation-wrapper top-margin">
                    <div className="page-navigation-option">
                        <div className='active-tag'>
                            TERMS & CONDITIONS
                        </div>
                    </div>
                </div>
            <div className='impressum-content-wrapper'>
                    <PortableText
                        value={pageContent[0].termsConditionsText}
                        components={textComponents}
                    />
            </div>

            <Footer type={'general'}/> 

        </div>
    )
}

export default TermsConditions