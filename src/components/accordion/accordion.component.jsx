import React, { useEffect, useState, useRef } from "react";

import "./accordion.styles.scss";

const Accordion = ({ children, isOpen, menuSectionReveal }) => {
  const contentRef = useRef();
  return (
    <div className="accordion menu-expanded-section">
      <div
        className={`content-wrapper ${isOpen ? "content-wrapper-open" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
