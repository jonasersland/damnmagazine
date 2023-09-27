import React, { useEffect, useState, useRef } from "react";
import sanityClient from "../../client.js";

import "./menuMobile.styles.scss";
import { useLocation, useNavigate } from "react-router-dom";
import AccordionMobile from "../accordion/accordionMobile.component";
import NewsletterSubscribe from "../newsletter-subscribe/newsletter-subscribe.component";

import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { AiOutlineMenu } from "react-icons/ai";
import { GrClose } from "react-icons/gr";

const MenuMobile = ({ menuOpen, setMenuOpen }) => {
  const [searchFieldActive, toggleSearchFieldActive] = useState(false);
  const [newsletterExpanded, toggleNewsletterExpanded] = useState(false);
  const [menuSectionReveal, setMenuSectionReveal] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [issue, setIssue] = useState(0);
  const [issueUrl, setIssueUrl] = useState(null);

  const navigate = useNavigate();

  const accordionToggleHandler = (input) => {
    console.log(input);
    if (input == false) {
      setMenuOpen(false);
    } else {
      if (searchFieldActive) {
        toggleSearchFieldActive(false);
        setTimeout(() => {
          setMenuOpen(true);
        }, 200);
      } else {
        console.log("input");
        setMenuOpen(true);
      }
    }
  };

  useEffect(() => {
    let fetchContentQuery = `{'latestIssueData':*[_id == 'settings']{...}[0]}`;
    sanityClient
      .fetch(fetchContentQuery)
      .then((data) => {
        setIssue(data.latestIssueData.latestIssueNumber);
        setIssueUrl(data.latestIssueData.latestIssueUrl);
      })
      .catch(console.error);
  }, []);

  const submitSearchHandler = () => {
    navigate("/search/" + searchInput);
  };
  const searchFieldHandler = (e) => {
    if (e.key == "Enter") {
      submitSearchHandler();
    }
  };

  const DAMNlogo = () => {
    return (
      <svg
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        viewBox="0 0 153.44 34.99"
      >
        <path
          className="st0"
          d="M153.41,5.27c-0.05,0.24-0.08,0.48-0.14,0.71c-0.48,1.8-1.64,2.91-3.45,3.31c-2.3,0.5-4.55-1-5.13-3.21
	c-0.65-2.46,1-5.06,3.49-5.48c2.37-0.4,4.63,1.12,5.13,3.46c0.04,0.2,0.07,0.4,0.1,0.6V5.27z M146.87,4.96
	c0.02,0.18,0.03,0.37,0.07,0.55c0.26,1.36,1.69,2.09,2.94,1.5c0.91-0.43,1.39-1.47,1.17-2.56c-0.24-1.19-1.37-1.93-2.55-1.68
	C147.56,2.96,146.85,3.9,146.87,4.96"
        />
        <path
          className="st0"
          d="M66.53,34.98V0.01h0.25c3.12,0,6.25,0,9.37-0.01c0.2,0,0.27,0.07,0.33,0.25c1.85,5.97,3.71,11.94,5.57,17.91
	c0.93,3,1.87,6,2.8,9c0.01,0.02,0.02,0.04,0.05,0.11c0.1-0.31,0.19-0.58,0.27-0.85c1.6-5.19,3.19-10.39,4.79-15.58
	c1.09-3.54,2.18-7.07,3.26-10.61C93.26,0.07,93.3,0,93.48,0c3.11,0.01,6.21,0,9.32,0.01c0.07,0,0.14,0.01,0.21,0.01v34.96h-6.19
	V7.56c-0.02,0-0.04-0.01-0.06-0.01c-0.09,0.26-0.18,0.52-0.26,0.78c-1.46,4.55-2.92,9.1-4.38,13.65c-1.37,4.27-2.74,8.53-4.1,12.8
	C87.98,34.95,87.9,35,87.72,35c-1.95-0.01-3.9-0.01-5.85,0c-0.21,0-0.29-0.08-0.35-0.26c-1.47-4.58-2.93-9.16-4.4-13.73
	c-1.42-4.44-2.85-8.88-4.27-13.32c-0.02-0.05-0.04-0.09-0.09-0.13v27.43H66.53z"
        />
        <path
          className="st0"
          d="M116.41,34.98h-6.24v-0.27c0-11.48,0-22.95-0.01-34.43c0-0.22,0.06-0.28,0.28-0.28c2.68,0.01,5.37,0.01,8.05,0
	c0.17,0,0.25,0.05,0.33,0.2c3.69,7.01,7.39,14.03,11.09,21.04c1.11,2.1,2.22,4.2,3.32,6.31c0.03,0.06,0.07,0.13,0.14,0.25V0.01h0.26
	c1.9,0,3.81,0,5.71,0c0.21,0,0.27,0.06,0.27,0.27c0,11.48,0,22.97,0,34.45v0.26c-0.1,0-0.18,0.01-0.26,0.01c-2.7,0-5.4,0-8.1,0
	c-0.16,0-0.24-0.05-0.32-0.19c-3.59-6.81-7.17-13.62-10.76-20.43c-1.22-2.3-2.43-4.61-3.65-6.92c-0.03-0.06-0.07-0.12-0.13-0.23
	V34.98z"
        />
        <path
          className="st0"
          d="M0,34.98V0.01h0.25c3.08,0,6.15-0.02,9.23,0.01c1.17,0.01,2.35,0.11,3.52,0.21c1.95,0.16,3.85,0.54,5.71,1.16
	c1.96,0.65,3.78,1.59,5.35,2.95c1.76,1.53,2.99,3.43,3.78,5.61c0.5,1.38,0.8,2.81,0.99,4.26c0.2,1.56,0.23,3.11,0.16,4.68
	c-0.09,2.25-0.46,4.45-1.28,6.55c-0.69,1.76-1.67,3.33-3.02,4.66c-1.54,1.52-3.36,2.58-5.38,3.33c-1.48,0.54-3,0.94-4.56,1.14
	c-1.28,0.16-2.57,0.27-3.85,0.38c-0.43,0.04-0.86,0.05-1.29,0.05c-3.16,0-6.32,0-9.48,0C0.08,34.99,0.06,34.99,0,34.98 M6.24,29.8
	c0.11,0,0.19,0,0.28,0c0.91-0.01,1.82,0,2.73-0.03c1.07-0.04,2.14-0.1,3.2-0.19c1.23-0.1,2.44-0.37,3.6-0.78
	c2.53-0.89,4.38-2.52,5.44-5.01c0.74-1.72,1.01-3.54,1.08-5.4c0.03-0.8-0.01-1.6-0.04-2.4c-0.04-1.11-0.22-2.19-0.51-3.26
	c-0.46-1.67-1.22-3.17-2.48-4.4c-1.13-1.11-2.5-1.82-4-2.28c-1.99-0.61-4.03-0.76-6.09-0.82C8.46,5.21,7.48,5.22,6.5,5.22
	c-0.08,0-0.17,0-0.26,0V29.8z"
        />
        <path
          className="st0"
          d="M38.83,27.64c-0.38,1.06-0.76,2.11-1.13,3.16c-0.48,1.35-0.96,2.69-1.44,4.04c-0.04,0.1-0.07,0.17-0.2,0.17
	c-2.05-0.01-4.1-0.01-6.15-0.01c-0.01,0-0.03-0.01-0.08-0.02c0.11-0.31,0.23-0.62,0.34-0.93c1.68-4.44,3.36-8.89,5.04-13.33
	c1.68-4.44,3.36-8.89,5.04-13.33c0.9-2.39,1.81-4.78,2.71-7.17C43.03,0.05,43.11,0,43.28,0c2.03,0.01,4.06,0.01,6.08,0
	c0.16,0,0.25,0.03,0.31,0.2c2.15,5.65,4.3,11.3,6.45,16.94c2.24,5.86,4.47,11.72,6.7,17.58c0.03,0.08,0.06,0.16,0.1,0.27h-0.27
	c-2.1,0-4.19,0-6.29,0c-0.18,0-0.26-0.05-0.32-0.23c-0.84-2.32-1.69-4.63-2.53-6.94c-0.05-0.14-0.11-0.2-0.27-0.2
	c-4.75,0-9.5,0-14.25,0H38.83z M51.59,22.45c-1.83-5.07-3.64-10.11-5.48-15.21c-1.82,5.1-3.62,10.15-5.43,15.21H51.59z"
        />
      </svg>
    );
  };

  return (
    <div
      className={`mobile-menu-wrapper ${menuOpen ? "menu-wrapper-open" : ""}`}
    >
      <div className="menu-section-logo" onClick={() => navigate("/")}>
        <DAMNlogo />
      </div>
      <div
        className="menu-toggle"
        onClick={() => {
          accordionToggleHandler(!menuOpen);
          toggleNewsletterExpanded(false);
        }}
      >
        {menuOpen ? (
          <span className="close">
            <GrClose />
          </span>
        ) : (
          <span className="open">
            <AiOutlineMenu />
          </span>
        )}
      </div>

      <div
        className={`menu-expanded-topics-section ${
          menuOpen ? "menu-expanded-open" : ""
        } `}
      >
        <div className={`menu-slogan`}>
          A Magazine for Opinions
          <br />
          on Contemporary Culture
        </div>

        <div className="menu-search-wrapper">
          <div className="menu-search-field">
            <input
              type="text"
              placeholder="Search"
              id="search-field"
              name="search-field"
              className="search-field-input"
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              onKeyPress={(e) => {
                searchFieldHandler(e);
              }}
            />
            <div
              className="menu-search-button theme-color"
              onClick={() => {
                submitSearchHandler();
              }}
            >
              <BiSearch />
            </div>
          </div>
        </div>

        <a className="menu-section-title" href="/about">
          ABOUT
        </a>
        <br />
        <a className="menu-section-title" href="/features">
          FEATURES
        </a>
        <br />
        <a className="menu-section-title" href="/calendar">
          CALENDAR
        </a>
        <br />
        <a className="menu-section-title" href="/research-realities">
          RESEARCH
          <br />& REALITIES
        </a>
        <br />
        <div className="menu-section-newsletter-wrapper">
          <div className="menu-section-newsletter">
            <div
              className="menu-section-title"
              onClick={() => toggleNewsletterExpanded(!newsletterExpanded)}
            >
              NEWSLETTER
            </div>
            <div
              className={`newsletter-expanded ${
                newsletterExpanded ? "newsletter-expanded-display" : ""
              }`}
            >
              {/* <div className="newsletter-subscribe-content"> */}
              <NewsletterSubscribe />
              {/* </div> */}
            </div>
          </div>
        </div>
        <div className="menu-section-title">
          <a
            target="_blank"
            className="a-no-style new theme-color"
            href="https://www.idecommedia.be/Abo_Pagina/Abonneer?Owner=DAMN&Brand=DAMN&ID=C7F239D5-E5EE-4567-8448-44B33B27A461"
          >
            SUBSCRIBE
          </a>
        </div>

        <div className="menu-section-follow">
          <div className="menu-section-social-label">FOLLOW US</div>
          <div className="menu-section-social-buttons">
            <span>
              <FaInstagramSquare />
            </span>
            <span>
              <FaFacebookSquare />
            </span>
            <span>
              <FaTwitterSquare />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuMobile;
