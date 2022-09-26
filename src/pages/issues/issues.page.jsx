import React, {useEffect, useState, useRef, useContext} from "react";
import sanityClient from "../../client.js";

import './issues.styles.scss'
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import Footer from "../../components/footer/footer.component";
import {PortableText} from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { useMediaQuery } from 'react-responsive'
import { GlobalContext } from "../../context/global-context"

import SingleIssueBlock from "./singleIssueBlock/singleIssueBlock.jsx";

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}

const Issues = ()=>{

    const windowImageHeight = Math.round(window.innerHeight * 0.7);

    const isNarrow = useMediaQuery({ query: '(max-width: 1100px)' })
    const [menuOpen, setMenuOpen] = useState(false);
    const [pageContent, setPageContent] = useState(null)
    const {setTitleHandler} = useContext(GlobalContext);
    setTitleHandler('DAMN Magazine - Issues')

    useEffect(() =>{ 
        let fetchContentQuery = `*[_type == "issue"]{...} | order(number desc)`
        sanityClient
        .fetch(fetchContentQuery)
        .then(data => {setPageContent(data)})
        .catch(console.error)
    },[]);

    console.log(pageContent)
    if(!pageContent) return <></>
    return(
        <div className="issues">
            {!isNarrow ?
                <Menu/>
                :
                <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
            }

            <div className='issues-wrapper'>
                <div className="page-navigation-wrapper top-margin">
                    <div className="page-navigation-option">
                        <a href='/about' className='active-tag'>
                            ABOUT
                        </a>
                    </div>
                    <div className="page-navigation-option" >
                        <span className="page-navigation-separator">/</span>
                        <a href='/archive' className='active-tag'>
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
                <div className="issues-grid-wrapper">
                    {pageContent.map(issue =>{
                        return (
                            <div key={issue._id} className="single-issue-wrapper">
                                <a href={`/issue/${issue.slug.current}`}>
                                    <div className="single-issue-image-wrapper">
                                        <img src={urlFor(issue.coverImage).height(400).url()}/>
                                    </div>
                                    <div className="single-issue-title-wrapper">
                                        DAMNº{issue.number}<br/>{issue.title}
                                    </div>
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Footer type={'general'}/> 

        </div>
    )
}

export default Issues