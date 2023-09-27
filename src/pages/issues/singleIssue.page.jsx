import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import sanityClient from "../../client.js";
import "./singleIssue.styles.scss";
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import Footer from "../../components/footer/footer.component";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { useMediaQuery } from "react-responsive";

import SingleIssueBlock from "./singleIssueBlock/singleIssueBlock.jsx";

const Issues = () => {
  const isNarrow = useMediaQuery({ query: "(max-width: 1100px)" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageContent, setPageContent] = useState(null);
  const [query, setQuery] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let slugArray = location.pathname.split("/");
    let slug = slugArray[slugArray.length - 1];
    setQuery(`*[_type == "issue" && slug.current == "${slug}"]{...}`);
  }, [location]);

  useEffect(() => {
    if (!query) return;
    sanityClient
      .fetch(query)
      .then((data) => {
        setPageContent(data);
      })
      .catch(console.error);
  }, [query]);

  console.log(pageContent);
  if (!pageContent) return <></>;
  return (
    <div className="single-issue">
      {!isNarrow ? (
        <Menu />
      ) : (
        <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}
      <div className="single-issue-wrapper">
        <div className="page-navigation-wrapper top-margin">
          <div className="page-navigation-option">
            <a href="/about" className="active-tag">
              ABOUT
            </a>
          </div>
          <div className="page-navigation-option">
            <span className="page-navigation-separator">/</span>
            <a href="/archive" className="active-tag">
              BACK ISSUES
            </a>
          </div>
          <div className="page-navigation-option">
            <span className="page-navigation-separator">/</span>
            <a href="/mediakit">MEDIA KIT</a>
          </div>
          <div className="page-navigation-option">
            <span className="page-navigation-separator">/</span>
            <a href="/contact">CONTACT</a>
          </div>
        </div>

        {pageContent.map((issue) => {
          return (
            <div key={issue._key} className="issue-wrapper">
              <SingleIssueBlock isNarrow={isNarrow} content={issue} />
            </div>
          );
        })}
      </div>

      <Footer type={"general"} />
    </div>
  );
};

export default Issues;
