import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import sanityClient from "../../client.js";
import "./collection-page.styles.scss";
import imageUrlBuilder from "@sanity/image-url";
import { useMediaQuery } from "react-responsive";

import Footer from "../../components/footer/footer.component";
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import FadeInSection from "../../components/fadeInSection/fadeInSection.component.jsx";

import { returnFormattedTitle, titleCase } from "../../utils/utils.js";
import { tryGetAssetDocumentId } from "@sanity/asset-utils";

import { BiPlay } from "react-icons/bi";
import { GlobalContext } from "../../context/global-context";

import { GrClose } from "react-icons/gr";

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

const SearchPage = ({ tags }) => {
  const [articleAmount, setArticleAmount] = useState("[0...10]");
  const [pageContent, setPageContent] = useState(null);
  const FourCol = useMediaQuery({ query: "(max-width: 1100px)" });
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

  const [searchInput, setSearchInput] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  useEffect(() => {
    setActiveTag(slug);
    setSearchInput(slug);
    let optionCap = titleCase(slug);
    let optionLower = slug.toLowerCase();
    let authorOption = slug;

    setQuery(`{
        'authorPosts':
        *[_type=="author" && title match "${authorOption}"]{
            'posts':*[^._id == author._ref]{
                ..., _id, _type, slug, title,thumbnail,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}
            }}[0],
        'articles':
        *[text[].children[].text match "${optionLower}" ||
        title match "${optionLower}" ||
        text[].children[].text match "${optionCap}" ||
        title match "${optionCap}"]
            {..., 
                _id, _type, slug, title,thumbnail,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}
            }
        }`);
  }, [slug]);

  useEffect(() => {
    if (!query) {
      return;
    }

    sanityClient
      .fetch(query)
      .then((data) => {
        // console.log(data)
        let combinedData = [...data.articles];
        if ("authorPosts" in data) {
          data.authorPosts.posts.map((post, index) => {
            // console.log(post)
            combinedData.push(post);
          });
        }

        let newArray = [];

        // Declare an empty object
        let uniqueObject = {};

        // Loop for the array elements
        for (let i in combinedData) {
          // Extract the title
          let objTitle = combinedData[i]["title"];

          // Use the title as the index
          uniqueObject[objTitle] = combinedData[i];
        }

        // Loop to push unique object into array
        for (let i in uniqueObject) {
          newArray.push(uniqueObject[i]);
        }

        // Display the unique objects

        let articles = { articles: newArray };
        setPageContent(articles);
      })
      .catch(console.error);
  }, [query]);

  const pageNavigationHandler = (option) => {
    console.log('pageNavigationHandler', option);

    if (!option) {
      setQuery(
        `{'articles': *[_type == 'article' || _type == 'researchreality'] {_id, _type, slug, title,thumbnail,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}}}`
      );
      setActiveTag("");
    }

    setActiveTag(option);
    setSearchInput(option);
    let optionCap = titleCase(option);
    let optionLower = option.toLowerCase();
    let authorOption = option;
    setQuery(`{
            'authorPosts':
            *[_type=="author" && title match "${authorOption}"]{
                'posts':*[^._id == author._ref]{
                    ..., _id, _type, slug, title,thumbnail,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}
                }}[0],
            'articles':
            *[text[].children[].text match "${optionLower}" ||
            title match "${optionLower}" ||
            text[].children[].text match "${optionCap}" ||
            title match "${optionCap}"]
                {..., 
                    _id, _type, slug, title,thumbnail,doubleWidth,'highlightItem':highlightItem[]{'asset':asset->}[0],"video": [video.asset->{...}],'eventData':[{startingTime, endingTime, place}], 'author':*[_id == ^.author._ref]{title}
                }
            }`);
    setActiveTag(option);
  };

  const searchFieldHandler = (e) => {
    if (e.key == "Enter") {
      window.location.href = "/search/" + searchInput;
    }
  };

  const returnSearchInputWidth = (txt, font) => {
    let element = document.createElement("canvas");
    let context = element.getContext("2d");
    context.font = font;
    return context.measureText(txt).width;
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
      // console.log('fourCol')
      let rows = [];
      let c = 0;
      let singleRow = [];
      for (var i = 0; pageContent.articles.length > i; i++) {
        c = c + 1;

        singleRow.push(pageContent.articles[i]);

        if (c == 4 || c == pageContent.articles.length) {
          // console.log('equal to 5', c)
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
          // console.log('equal to 5', c)
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
            Search
          </div>
          <div className="page-navigation-option">
            <span className="page-navigation-separator">/</span>
            <input
              type="text"
              placeholder={searchInput}
              id="search-field"
              name="search-field"
              style={{
                width:
                  40 +
                  returnSearchInputWidth(searchInput, "36px 'Suisse Medium'"),
              }}
              className="page-navigation-search-field-input"
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              onKeyPress={(e) => {
                searchFieldHandler(e);
              }}
            />
          </div>
        </div>
        <div className="collection-page-article-section">
          <div className="collection-page-article-row">
            {pageContent == null ? (
              <>Loading</>
            ) : pageContent.articles.length > 0 ? (
              pageContent.articles
                .filter((article) => {
                  // console.log(article.high)
                  if ("highlightItem" in article) {
                    // console.log(article.highlighItem)
                    if ("asset" in article.highlightItem) {
                      return true;
                    }
                  }
                  return false;
                })
                .map((article, index) => {
                  // console.log(article)
                  let imageHeight = { ratio: "height-ratio-100", value: 1 };

                  // console.log(article)
                  if (
                    article.highlightItem.asset._type == "sanity.imageAsset"
                  ) {
                    imageHeight = returnImageHeight(
                      article.highlightItem.asset._id
                    );
                  } else {
                    imageHeight = { ratio: "height-ratio-025", value: 1 };
                  }
                  // console.log(imageHeight)
                  return (
                    <FadeInSection key={article._id}>
                      <div className={`collection-page-article single-width`}>
                        {/* {console.log(article)} */}
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
                            {/* {console.log(article)} */}
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
                                  {/* {console.log(article)} */}
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
                })
            ) : (
              <div>Sorry, no results</div>
            )}
          </div>
        </div>
      </div>
      <Footer type={"general"} />
    </div>
  );
};

export default SearchPage;
