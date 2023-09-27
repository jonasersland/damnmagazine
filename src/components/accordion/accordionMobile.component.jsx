import React, { useEffect, useState, useRef } from "react";

import "./accordionMobile.styles.scss";

const Accordion = ({ children, menuOpen }) => {
  return (
    <div className="accordion menu-expanded-section">
      <div
        style={
          menuOpen
            ? {
                height: window.innerHeight,
                opacity: 1,
              }
            : {
                marginTop: "0px",
                height: "0px",
                opacity: 0,
              }
        }
        className={`content-wrapper ${
          menuOpen ? "content-open" : "content-closed"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
