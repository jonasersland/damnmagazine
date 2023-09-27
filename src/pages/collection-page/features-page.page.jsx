import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import sanityClient from "../../client.js";
import "./collection-page.styles.scss";
import imageUrlBuilder from "@sanity/image-url";
import { useMediaQuery } from "react-responsive";
import Footer from "../../components/footer/footer.component";
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import FadeInSection from "../../components/fadeInSection/fadeInSection.component.jsx";
import { returnFormattedTitle } from "../../utils/utils.js";

import { BiPlay } from "react-icons/bi";
import { GlobalContext } from "../../context/global-context";

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

const FeaturesPage = ({ tags }) => {
  const [articleAmount, setArticleAmount] = useState("[0...10]");
  const [pageContent, setPageContent] = useState(null);
  const FourCol = useMediaQuery({ query: "(max-width: 1200px)" });
  const threeCol = useMediaQuery({ query: "(max-width: 700px)" });
  const oneCol = useMediaQuery({ query: "(max-width: 540px)" });
  const isNarrow = useMediaQuery({ query: "(max-width: 1100px)" });

  let singleWidthImage;

  if (oneCol) {
    singleWidthImage = Math.round(window.innerWidth * 2);
  } else if (threeCol) {
    singleWidthImage = Math.round((window.innerWidth / 3) * 2);
  } else if (FourCol) {
    singleWidthImage = Math.round((window.innerWidth / 4) * 2);
  } else {
    singleWidthImage = Math.round((window.innerWidth / 5) * 2);
  }

  const [queryFilter, setQueryFilter] = useState(null);
  const [query, setQuery] = useState(null);
  const [activeTag, setActiveTag] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { setTitleHandler } = useContext(GlobalContext);
  setTitleHandler("DAMN Magazine - Features");

  useEffect(() => {
    if (location.pathname.includes("/features/")) {
      let currentLocation = location.pathname.replace("/features/", "");
      if (!currentLocation) {
        setQuery(
          `{'articles': *[_type == 'article']{_id,originallyPublished, _createdAt, _type, slug, title,thumbnail, doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}} | order(_createdAt desc) | order(originallyPublished desc)}`
        );
      } else {
        let optionCap =
          currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1);
        setQuery(
          `{'articles': *[_type == 'article' && "${optionCap}" in tags[].label] {_id,originallyPublished,_createdAt, _type, slug, title,thumbnail,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}} | order(_createdAt desc) | order(originallyPublished desc)}`
        );
        setActiveTag(optionCap);
      }
    } else {
      setQuery(
        `{'articles': *[_type == 'article']{_id,originallyPublished, _createdAt, _type, slug, title,thumbnail, doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}} | order(_createdAt desc) | order(originallyPublished desc)}`
      );
    }
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

  const pageNavigationHandler = (option) => {
    if (!option) {
      setActiveTag(null);
      navigate(`/features/`);
    } else {
      let optionCap = option.charAt(0).toUpperCase() + option.slice(1);
      navigate(`/features/${optionCap}`);
    }
  };

  const returnImageHeight = (asset) => {
    const string = asset.split("-");
    const size = string[2].split("x");

    const getDimension = (size) => {
      let ratio = size[0] / size[1];
      if (ratio > 1.3) {
        return { ratio: "height-ratio-025", value: ratio };
      }
      if (ratio <= 1.3 && ratio > 1.1) {
        return { ratio: "height-ratio-050", value: ratio };
      }
      if (ratio <= 1.1 && ratio > 0.8) {
        return { ratio: "height-ratio-075", value: ratio };
      }
      if (ratio <= 0.8) {
        return { ratio: "height-ratio-100", value: ratio };
      }
    };

    return getDimension(size);
  };

  const returnColAmount = () => {
    if (oneCol) {
      return "oneCol";
    }
    if (threeCol) {
      return "threeCol";
    }
    if (FourCol) {
      return "fourCol";
    } else return "fiveCol";
  };

  const articleRows = () => {
    if (pageContent.articles.length < 1) {
      return [];
    }

    if (returnColAmount() == "fiveCol") {
      let rows = [];
      let c = 0;
      let singleRow = [];
      for (var i = 0; pageContent.articles.length > i; i++) {
        c = c + 1;
        singleRow.push(pageContent.articles[i]);

        if (c == 5 || c == pageContent.articles.length) {
          rows.push([...singleRow]);
          c = 0;
          singleRow = [];
        }
      }
      return rows;
    }
    if (returnColAmount() == "fourCol") {
      let rows = [];
      let c = 0;
      let singleRow = [];
      for (var i = 0; pageContent.articles.length > i; i++) {
        c = c + 1;

        singleRow.push(pageContent.articles[i]);

        if (c == 4 || c == pageContent.articles.length) {
          rows.push([...singleRow]);
          c = 0;
          singleRow = [];
        }
      }
      return rows;
    }
    if (returnColAmount() == "threeCol") {
      let rows = [];
      let c = 0;
      let singleRow = [];
      for (var i = 0; pageContent.articles.length > i; i++) {
        c = c + 1;
        singleRow.push(pageContent.articles[i]);

        if (c == 3 || c == pageContent.articles.length) {
          rows.push([...singleRow]);
          c = 0;
          singleRow = [];
        }
      }
      return rows;
    }
    if (returnColAmount() == "oneCol") {
      let rows = [];
      let singleRow = [];
      for (var i = 0; pageContent.articles.length > i; i++) {
        rows.push([pageContent.articles[i]]);
      }
      return rows;
    }
  };

  if (!pageContent) return <></>;
  return (
    <div className={`collection-page ${returnColAmount()}`}>
      {!isNarrow ? (
        <Menu />
      ) : (
        <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}
      <div
        className={`collection-page-content-wrapper`}
        style={{ opacity: menuOpen ? 0 : 1 }}
      >
        <div className="page-navigation-wrapper">
          <div
            className="page-navigation-title"
            onClick={() => {
              pageNavigationHandler(false);
            }}
          >
            Features
          </div>
          {tags.length > 1
            ? tags.map((option, index) => {
                return (
                  <div
                    key={"o" + index}
                    className="page-navigation-option"
                    onClick={() => {
                      pageNavigationHandler(option);
                    }}
                  >
                    <span className="page-navigation-separator">/</span>
                    <span className={activeTag == option ? "active-tag" : ""}>
                      {option}
                    </span>
                  </div>
                );
              })
            : ""}
        </div>
        <div className="collection-page-article-section">
          {articleRows().length > 0 ? (
            articleRows().map((row, index) => {
              return (
                <div key={"r" + index} className="collection-page-article-row">
                  {row.map((article, index) => {
                    let imageHeight = { ratio: "height-ratio-100", value: 1 };
                    if (
                      article.highlightItem.asset._type == "sanity.imageAsset"
                    ) {
                      imageHeight = returnImageHeight(
                        article.highlightItem.asset._id
                      );
                    } else {
                      imageHeight = { ratio: "height-ratio-025", value: 1 };
                    }
                    return (
                      <FadeInSection key={article._id}>
                        <div className={`collection-page-article single-width`}>
                          <a
                            href={
                              "slug" in article
                                ? "/" + article.slug.current
                                : article.url
                            }
                          >
                            <div
                              className={`collection-page-article-image ${
                                !oneCol ? imageHeight.ratio : "height-ratio-100"
                              }`}
                            >
                              {console.log(article)}
                              {"highlightItem" in article ? (
                                article.highlightItem.asset._type ==
                                "sanity.imageAsset" ? (
                                  <img
                                    src={urlFor(article.highlightItem.asset._id)
                                      .width(singleWidthImage)
                                      .url()}
                                  />
                                ) : (
                                  <div className="video-thumbnail-wrapper">
                                    <div className="video-play-button">
                                      <BiPlay />
                                    </div>
                                    {"thumbnail" in article ? (
                                      <img
                                        src={urlFor(article.thumbnail.asset)
                                          .width(singleWidthImage)
                                          .url()}
                                      />
                                    ) : (
                                      <img
                                        src={`https://image.mux.com/${article.highlightItem.asset.playbackId}/thumbnail.jpg?width=${singleWidthImage}`}
                                      />
                                    )}
                                  </div>
                                )
                              ) : (
                                ""
                              )}
                            </div>

                            <div className="collection-page-article-label">
                              <div className="collection-page-article-title">
                                {article._type !== "ad"
                                  ? returnFormattedTitle(article.title)
                                  : ""}
                              </div>
                              <div className="collection-page-article-byline">
                                {article.author.length > 0
                                  ? article.author[0].title
                                  : ""}
                                {article._type == "event" &&
                                article.eventData[0].place !== undefined
                                  ? article.eventData[0].place[0].label
                                  : ""}
                              </div>
                            </div>
                          </a>
                        </div>
                      </FadeInSection>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <div className="no-results">Sorry, no results</div>
          )}
        </div>
      </div>
      <Footer type={"general"} />
    </div>
  );
};

export default FeaturesPage;
