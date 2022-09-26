import React, {useEffect, useState, useRef, useContext} from "react";
import sanityClient from "../../client.js";
import './issues.styles.scss'
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import Footer from "../../components/footer/footer.component";
import {PortableText} from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { useMediaQuery } from 'react-responsive'

import SingleIssueBlock from "./singleIssueBlock/singleIssueBlock.jsx";

const Issues = ()=>{

    const windowImageHeight = Math.round(window.innerHeight * 0.7);

    const isNarrow = useMediaQuery({ query: '(max-width: 1100px)' })
    const [menuOpen, setMenuOpen] = useState(false);
    const [pageContent, setPageContent] = useState(null)

    useEffect(() =>{ 
        let fetchContentQuery = `*[_type == "issue"]{...}`
        sanityClient
        .fetch(fetchContentQuery)
        .then(data => {setPageContent(data)})
        .catch(console.error)
    },[]);

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

            {pageContent.map(issue =>{
                return (
                    <div key={issue._key} className="issue-wrapper">
                        <SingleIssueBlock isNarrow={isNarrow} content={issue}/>
                    </div>
                )
            })}
            </div>

            <Footer type={'general'}/> 

        </div>
    )
}

export default Issues