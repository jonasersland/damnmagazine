import React, {useEffect, useState,useContext} from "react";
import sanityClient from "../../client.js";
import './contact.styles.scss'
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import Footer from "../../components/footer/footer.component";
import {PortableText} from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { useMediaQuery } from 'react-responsive'
import { GlobalContext } from "../../context/global-context"

// import { IDFA } from 'react-native-idfa';

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}

// function createMarkup() {
//     return {__html: '<SCRIPT language="JavaScript1.1" SRC="https://ad.doubleclick.net/ddm/trackimpj/N1160093.4504651MKTWORLDWIDE/B27905079.337191716;dc_trk_aid=529114643;dc_trk_cid=172106870;ord=[timestamp];dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ltd=?"></SCRIPT>'};
//   }

//   function MyComponent() {
//     return <div dangerouslySetInnerHTML={createMarkup()} />;
//   }

const Contact = ()=>{

    const isNarrow = useMediaQuery({ query: '(max-width: 1100px)' })
    const [menuOpen, setMenuOpen] = useState(false);
    const [pageContent, setPageContent] = useState(null)
    const {setTitleHandler} = useContext(GlobalContext);
    setTitleHandler('DAMN Magazine - Contact')

    useEffect(() =>{ 
        // const script = document.createElement("script");
        // script.src = "https://ad.doubleclick.net/ddm/trackimpj/N1160093.4504651MKTWORLDWIDE/B27905079.337191716;dc_trk_aid=529114643;dc_trk_cid=172106870;ord=[timestamp];dc_lat=;dc_rdid=;tag_for_child_directed_treatment=0;tfua=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ltd=?";
        // script.async = true;
        // document.body.appendChild(script);
    })

    useEffect(() =>{ 
        let fetchContentQuery = `*[_id == "contact"]{leftCol, righttCol}[0]`
        sanityClient
        .fetch(fetchContentQuery)
        .then(data => {setPageContent(data)})
        .catch(console.error)
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

    if(!pageContent) return <></>
    return(
        <div className="contact">
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
                        <a href='/contact' className='active-tag'>
                            CONTACT
                        </a>
                    </div>
                </div>
            <div className='contact-content-wrapper'>
                <div className="contact-leftcol">
                    <PortableText
                        value={pageContent.leftCol}
                        components={textComponents}
                    />
                </div>
                <div className="contact-rightcol">
                    <PortableText
                        value={pageContent.righttCol}
                        components={textComponents}
                    />
                </div>
{/* Kan kanskje prøve å bare bruke image tracker? */}
                {/* <img className="image-tracker" src="https://ad.doubleclick.net/ddm/trackimp/N1160093.4504651MKTWORLDWIDE/B27905079.337191716;dc_trk_aid=529114643;dc_trk_cid=172106870;ord=[timestamp];dc_lat=1;dc_rdid=0;tag_for_child_directed_treatment=0;tfua=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ltd=?" border="0" height="1" width="1" alt="Advertisement"/> */}
                
            </div>

            <Footer type={'general'}/> 

        </div>
    )
}

export default Contact