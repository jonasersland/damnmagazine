import React, { useEffect, useState, useContext } from "react";
import sanityClient from "../../client.js";
import "./newsletterSignup.styles.scss";
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import Footer from "../../components/footer/footer.component";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { useMediaQuery } from "react-responsive";
import { GlobalContext } from "../../context/global-context";
import NewsletterSubscribe from "../../components/newsletter-subscribe/newsletter-subscribe.component";

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

const NewsletterSignup = () => {
  const isNarrow = useMediaQuery({ query: "(max-width: 1100px)" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageContent, setPageContent] = useState(null);
  const { setTitleHandler } = useContext(GlobalContext);

  useEffect(() => {
    let fetchContentQuery = `*[_id == "settings"]{newsletterSignup{...}}`;
    sanityClient
      .fetch(fetchContentQuery)
      .then((data) => {
        setPageContent(data);
      })
      .catch(console.error);
    setTitleHandler("DAMN Magazine - Newsletter");
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
    <div className="newsletter">
      {!isNarrow ? (
        <Menu />
      ) : (
        <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}
      <div className="page-navigation-wrapper top-margin">
        <div className="page-navigation-option">
          <div className="active-tag">
            {pageContent[0].newsletterSignup.title}
          </div>
        </div>
      </div>
      <div className="newsletter-content-wrapper">
        <div className="newsletter-content">
          {"image" in pageContent[0].newsletterSignup ? (
            <div className="newsletter-content-image">
              <img src={urlFor(pageContent[0].newsletterSignup.image).url()} />
            </div>
          ) : (
            ""
          )}
          <div className="newsletter-text-wrapper">
            <PortableText
              value={pageContent[0].newsletterSignup.text}
              components={textComponents}
            />
          </div>
          <div className="newsletter-signup-wrapper">
            <div className="newsletter-signup-form">
              <NewsletterSubscribe />
            </div>
          </div>
        </div>
      </div>

      <Footer type={"general"} />
    </div>
  );
};

export default NewsletterSignup;
