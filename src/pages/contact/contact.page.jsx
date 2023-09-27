import React, { useEffect, useState, useContext } from "react";
import sanityClient from "../../client.js";
import "./contact.styles.scss";
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import Footer from "../../components/footer/footer.component";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { useMediaQuery } from "react-responsive";
import { GlobalContext } from "../../context/global-context";

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

const Contact = () => {
  const isNarrow = useMediaQuery({ query: "(max-width: 1100px)" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageContent, setPageContent] = useState(null);
  const { setTitleHandler } = useContext(GlobalContext);
  setTitleHandler("DAMN Magazine - Contact");

  useEffect(() => {
    let fetchContentQuery = `*[_id == "contact"]{leftCol, righttCol}[0]`;
    sanityClient
      .fetch(fetchContentQuery)
      .then((data) => {
        setPageContent(data);
      })
      .catch(console.error);
  }, []);

  const textComponents = {
    marks: {
      link: (props) => {
        if (props.value.href.includes("@")) {
          return <a href={"mailto:" + props.value.href}>{props.children}</a>;
        } else {
          return (
            <a href={props.value.href} target="_blank" rel="noopener">
              {props.children}
            </a>
          );
        }
      },
    },
    types: {
      image: ({ value }) => <img src={value.imageUrl} />,
      quote: ({ value }) => {
        return (
          <div className="content-quote-wrapper">
            <span className="content-quote">
              &ldquo;
              <PortableText value={value.content} />
              &rdquo;
            </span>
            <span className="content-quote-person">
              &#8212; {value.quotePerson}
            </span>
          </div>
        );
      },
    },
  };

  if (!pageContent) return <></>;
  return (
    <div className="contact">
      {!isNarrow ? (
        <Menu />
      ) : (
        <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}
      <div className="page-navigation-wrapper top-margin">
        <div className="page-navigation-option">
          <a href="/about" className="active-tag">
            ABOUT
          </a>
        </div>
        <div className="page-navigation-option">
          <span className="page-navigation-separator">/</span>
          <a href="/archive">BACK ISSUES</a>
        </div>
        <div className="page-navigation-option">
          <span className="page-navigation-separator">/</span>
          <a href="/mediakit">MEDIA KIT</a>
        </div>
        <div className="page-navigation-option">
          <span className="page-navigation-separator">/</span>
          <a href="/contact" className="active-tag">
            CONTACT
          </a>
        </div>
      </div>
      <div className="contact-content-wrapper">
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
      </div>

      <Footer type={"general"} />
    </div>
  );
};

export default Contact;
