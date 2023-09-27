import React, { useEffect, useState, useContext } from "react";
import sanityClient from "../../client.js";
import "./404.styles.scss";
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import Footer from "../../components/footer/footer.component";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { useMediaQuery } from "react-responsive";
import { GlobalContext } from "../../context/global-context";
import NewsletterSubscribe from "../../components/newsletter-subscribe/newsletter-subscribe.component";

const Page404 = () => {
  const isNarrow = useMediaQuery({ query: "(max-width: 1100px)" });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="page404">
      {!isNarrow ? (
        <Menu />
      ) : (
        <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}

      <div className="page404-content-wrapper">
        Sorry! There doesn't seem to be anything here yet.
      </div>

      <Footer type={"general"} />
    </div>
  );
};

export default Page404;
