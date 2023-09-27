import React, { useEffect, useState, useRef } from "react";

import "./accordion.styles.scss";

const AccordionNewsletter = ({
  children,
  newsletterExpanded,
  menuSectionReveal,
}) => {
  const contentRef = useRef();

  return (
    <div className="accordion menu-expanded-section">
      <div
        ref={contentRef}
        style={
          newsletterExpanded
            ? {
                height: contentRef.current.scrollHeight,
                opacity: 1,
              }
            : {
                marginTop: "0px",
                height: "0px",
                opacity: 0,
              }
        }
        className={`content-wrapper ${newsletterExpanded ? "open" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionNewsletter;
