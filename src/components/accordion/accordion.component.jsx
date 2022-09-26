import React, {useEffect, useState, useRef} from "react";

import './accordion.styles.scss';

const Accordion = ({children, isOpen, menuSectionReveal}) =>{
    const contentRef = useRef();

    // const [height, setHeight] = useState(0)

    // useEffect(()=>{
    //     //console.log(contentRef.current.scrollHeight)
    //     setHeight(contentRef.current.scrollHeight)
    // },[isOpen, menuSectionReveal])
    return (
        <div className='accordion menu-expanded-section'>
            <div
            //  ref={contentRef}
            //  style={
            //     isOpen
            //       ? { 
            //           height: '40px',
            //           opacity: 1
            //          }
            //       : { 
            //           marginTop: "0px",
            //           height: "0px",
            //           opacity: 0
            //         }
            //   }
             className={`content-wrapper ${isOpen ? 'content-wrapper-open' : ''}`}>
                {children}
            </div>
        </div>
    )
}

export default Accordion