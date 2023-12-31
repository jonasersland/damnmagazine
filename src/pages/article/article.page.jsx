import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import sanityClient from "../../client.js";
import "./article.styles.scss";
import Menu from "../../components/menu/menu.component";
import MenuMobile from "../../components/menu/menuMobile.component";
import Footer from "../../components/footer/footer.component";
import { returnFormattedTitle } from "../../utils/utils.js";
import { PortableText } from "@portabletext/react";
import SanityMuxPlayer from "sanity-mux-player";
import imageUrlBuilder from "@sanity/image-url";
import { useMediaQuery } from "react-responsive";
import convertQuotationMarks from "../../utils/convertQuotationMarks.js";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import {
  InstagramEmbed,
  TwitterEmbed,
  TikTokEmbed,
} from "react-social-media-embed";
import ReactPlayer from "react-player";
import {
  Player,
  Hls,
  Ui,
  DefaultUi,
  DefaultControls,
  ClickToPlay,
  noSpinner,
  noSkeleton,
  Scrim,
  Controls,
  ControlSpacer,
  MuteControl,
  PlaybackControl,
  TimeProgress,
  Poster,
  LoadingScreen,
} from "@vime/react";
import { isSafari } from "react-device-detect";

import DAMNlightbox from "../../components/lightbox/DAMNlightbox";
import NewsletterSubscribe from "../../components/newsletter-subscribe/newsletter-subscribe.component";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { GlobalContext } from "../../context/global-context";
import SlideshowCursor from "../../components/slideshowCursor/slideshowCursor.component";

import Page404 from "../404/404.page.jsx";

import { BiPlay } from "react-icons/bi";
import { FaFacebookSquare, FaTwitterSquare } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

const SingleVideoPlayer = ({ thumbnail, assetDocument, aspectRatio }) => {
  const isNarrow = useMediaQuery({ query: "(max-width: 1100px)" });

  let currentThumbnail = undefined;

  if (thumbnail == null || thumbnail == undefined) {
    if ("thumbTime" in assetDocument) {
      currentThumbnail = `https://image.mux.com/${assetDocument.playbackId}/thumbnail.jpg?time=${assetDocument.thumbTime}&width=${window.innerWidth}`;
    } else {
      currentThumbnail = `https://image.mux.com/${assetDocument.playbackId}/thumbnail.jpg?time=0&width=${window.innerWidth}`;
    }
  } else {
    currentThumbnail = urlFor(thumbnail.asset)
      .width(Math.round(window.innerWidth))
      .url();
  }

  const video = useRef();
  const [videoInit, setVideoInit] = useState(false);
  const [playing, togglePlaying] = useState(false);

  useEffect(() => {
    togglePlaying(false);
  }, []);
  const playbuttonHandler = () => {
    togglePlaying(!playing);
  };
  if (currentThumbnail == undefined) return <></>;
  return (
    <>
      {!isNarrow ? (
        <div className="video-player-wrapper">
          <div
            onClick={() => togglePlaying(!playing)}
            className="video-play-button"
            style={{ display: playing ? "none" : "grid" }}
          >
            <BiPlay />
          </div>
          <Player
            aspectRatio={aspectRatio != undefined ? aspectRatio : "16:9"}
            className="vime-player"
            // onVmPlay={()=>togglePlaying(!playing)}
            onVmPausedChange={() => togglePlaying(!playing)}
            currentSrc={`https://stream.mux.com/${assetDocument.playbackId}.m3u8`}
            currentPoster={currentThumbnail}
            autoplay="false"
            playsinline
            viewType="video"
          >
            <DefaultUi noSpinner="true" noSkeleton="true">
              <Poster />
              <ClickToPlay useOnMobile="true" />
              <LoadingScreen hideDots="true" />
            </DefaultUi>
            <Hls version="latest" poster={currentThumbnail}>
              <source
                data-src={`https://stream.mux.com/${assetDocument.playbackId}.m3u8`}
                type="application/x-mpegURL"
              />
            </Hls>
          </Player>
        </div>
      ) : (
        <div className="video-player-wrapper">
          <div
            className="video-play-button"
            style={{ display: playing ? "none" : "grid" }}
          >
            <BiPlay />
          </div>

          <Player
            aspectRatio={aspectRatio != undefined ? aspectRatio : "16:9"}
            className="vime-player"
            onClick={() => {
              togglePlaying(true);
            }}
            onPause={() => {
              console.log("paused");
              togglePlaying(false);
            }}
            currentSrc={`https://stream.mux.com/${assetDocument.playbackId}.m3u8`}
            currentPoster={currentThumbnail}
            controls="true"
            playsinline
            viewType="video"
            paused={playing}
          >
            <Ui LoadingScreen Poster>
              <Poster />
              <LoadingScreen hideDots="true" />
            </Ui>
            <Hls version="latest">
              <source
                data-src={`https://stream.mux.com/${assetDocument.playbackId}.m3u8`}
                type="application/x-mpegURL"
              />
            </Hls>
          </Player>
        </div>
      )}
    </>
  );
};

const Article = () => {
  const isNarrow = useMediaQuery({ query: "(max-width: 1100px)" });
  let windowImageHeight;
  if (isNarrow) {
    windowImageHeight = Math.round(window.innerHeight * 2);
  } else {
    windowImageHeight = Math.round(window.innerHeight * 0.7);
  }
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsletterShowing, toggleNewsletterShowing] = useState(false);

  const { cursorChangeHandler, cookiePreferences, setTitleHandler } =
    useContext(GlobalContext);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const [pageContent, setPageContent] = useState(null);
  const [showErrorPage, toggleShowErrorPage] = useState(false);
  const [pageAd, setPageAd] = useState(null);
  const [issueLink, setIssueLink] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullscreenImages, setFullscreenImages] = useState(null);

  const [footnotesArray, setFootnotesArray] = useState(null);

  const [allowTracking, toggleAllowTracking] = useState(false);

  const videoRef = useRef();
  const [videoPlaying, toggleVideoPlaying] = useState(false);

  let location = useLocation();
  const navigate = useNavigate();

  const currentSlug = location.pathname.replace("/", "");

  useEffect(() => {
    let fetchContentQuery = `{'issueLink':*[_type == "settings"]{latestIssueUrl}[0], 'article':*[slug.current == "${currentSlug}"]{..., text[]{...,_type == "contentRow" => {..., contentRowItem[]{...,'videoAsset':video.asset->{...}}}}, "issue":*[_id == ^.issue._ref]{number}, hideRelated, "tags":[tags], highlightItem[]{'asset':asset->, ...}, slideshow[]{'asset':asset->, ...},'author':*[_id == ^.author._ref]{...}}[0], 'ad':*[_id == 'settings']{articleAd}[0]}`;
    sanityClient
      .fetch(fetchContentQuery)
      .then((data) => {
        if ("article" in data) {
          setPageContent(data.article);
          setPageAd(data.ad);
          setIssueLink(data.issueLink.latestIssueUrl);
        } else {
          toggleShowErrorPage(true);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!pageContent) return;
    setTitleHandler(`DAMN Magazine - ${pageContent.title}`);
  }, [pageContent]);

  //   const returnInsetHTML = (code) => {
  //     let newCode = code;

  //     function createMarkup(newCode) {
  //       let newCodeEdited = newCode
  //         .replace("${GDPR}", "true")
  //         .replace("${GDPR_CONSENT_755}", "true")
  //         .replace("dc_lat=", "dc_lat=0")
  //         .replace(
  //           "tag_for_child_directed_treatment=",
  //           "tag_for_child_directed_treatment=0"
  //         )
  //         .replace("tfua=", "tfua=0")
  //         .replace("ltd=", "ltd=0");

  //       if (newCodeEdited.includes("[timestamp]")) {
  //         let timestampedCode = newCodeEdited.replace("[timestamp]", Date.now());
  //         return { __html: timestampedCode };
  //       } else {
  //         return { __html: newCodeEdited };
  //       }
  //     }
  //     return <span dangerouslySetInnerHTML={createMarkup(newCode)} />;
  //   };

  // for special impression tracker code that can be added to particular posts (like paid content). First check the tracking settings of the current visitor.
  const returnInsetIframeHTML = (code) => {
    let marketingState = localStorage.marketing;
    if (marketingState == undefined || marketingState == "false") {
      return <></>;
    }

    let newCode = code;
    function createMarkup(newCode) {
      let newCodeEdited = newCode
        .replace("${GDPR}", "true")
        .replace("${GDPR_CONSENT_755}", "true")
        .replace("dc_lat=", "dc_lat=0")
        .replace(
          "tag_for_child_directed_treatment=",
          "tag_for_child_directed_treatment=0"
        )
        .replace("tfua=", "tfua=0")
        .replace("ltd=", "ltd=0");
      if (newCodeEdited.includes("[timestamp]")) {
        let timestampedCode = newCodeEdited.replace("[timestamp]", Date.now());
        return { __html: timestampedCode };
      } else {
        return { __html: newCodeEdited };
      }
    }
    return (
      <span
        style={{ position: "absolute", height: 0, width: 0 }}
        dangerouslySetInnerHTML={createMarkup(newCode)}
      />
    );
  };

  const returnMetaNavigation = (type, tags) => {
    if (type == "event") {
      return (
        <span>
          <a href={"/calendar/"}>CALENDAR</a>
        </span>
      );
    } else if (type == "article") {
      const filteredTags = tags.filter((tag) => {
        return (
          tag.label == "Art" ||
          tag.label == "Design" ||
          tag.label == "Architecture"
        );
      });
      return (
        <span>
          <a href={"/features/"}>FEATURES</a>{" "}
          {filteredTags.map((tag, index) => {
            return (
              <span key={`metaTag${index}`}>
                {" "}
                /{" "}
                <a href={`/features/${tag.label}`}>{tag.label.toUpperCase()}</a>
              </span>
            );
          })}
        </span>
      );
    } else if (type == "researchreality") {
      const filteredTags = tags.filter((tag) => {
        return (
          tag.label == "Institution" ||
          tag.label == "Company" ||
          tag.label == "Product" ||
          tag.label == "Products"
        );
      });
      const returnFormattedTagTitle = (tag) => {
        if (tag == "Institution") return "INSTITUTIONS";
        if (tag == "Company") return "COMPANY NEWS";
        if (tag == "Product" || tag == "Products") return "PRODUCTS";
      };
      return (
        <span>
          <a href={"research-realities/"}>RESEARCH & REALITIES</a>{" "}
          {filteredTags.map((tag, index) => {
            return (
              <span key={`metaTag${index}`}>
                {" "}
                /{" "}
                <a href={`/research-realities/${tag.label}`}>
                  {returnFormattedTagTitle(tag.label)}
                </a>
              </span>
            );
          })}
        </span>
      );
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

  const returnImageWidth = (asset) => {
    if (isNarrow) return window.innerWidth - 40;

    const string = asset.split("-");
    const size = string[2].split("x");

    const getDimension = (size) => {
      let ratio = size[0] / size[1];
      let newWidth = windowImageHeight * ratio;
      return newWidth;
    };

    return getDimension(size);
  };

  const returnVideoWidth = (ratio) => {
    if (isNarrow) return window.innerWidth - 40;
    const size = ratio.split(":");

    const getDimension = (size) => {
      let ratio = size[0] / size[1];
      let newWidth = windowImageHeight * ratio;
      return newWidth;
    };

    return getDimension(size);
  };

  const returnVideoHeight = (ratio) => {
    if (!isNarrow) return windowImageHeight;
    const size = ratio.split(":");
    const getDimension = (size) => {
      let ratio = size[1] / size[0];
      let newHeight = (window.innerWidth - 40) * ratio;
      return newHeight;
    };

    return getDimension(size);
  };

  const returnFooterType = () => {
    if ("hideRelated" in pageContent) {
      if (pageContent.hideRelated === true) {
        return "general";
      }
    }
    return pageContent._type;
  };

  let footnotes = [];
  let images = [];

  function addToFootnotes(value) {
    footnotes.push(value);
  }

  function addToImages(value) {
    images.push(value);
  }

  useEffect(() => {
    if (footnotesArray !== null || footnotes.length == 0) {
      return;
    } else {
      setFootnotesArray(footnotes);
    }
  }, [footnotes]);

  useEffect(() => {
    if (fullscreenImages !== null || !pageContent) {
      return;
    } else {
      let allImages = [];
      if ("slideshow" in pageContent) {
        let slideshowImages = pageContent.slideshow.filter((slide) => {
          return slide._type == "image";
        });
        allImages = [...slideshowImages, ...images];
      }
      if (allImages.length !== 0) {
        setFullscreenImages(allImages);
      }
    }
  });

  const addSlideShowImages = () => {
    // console.log('adding')
  };

  const articleTextComponents = {
    marks: {
      link: ({ mark, children }) => {
        const { href } = mark;
        return (
          <a href={href} target="_blank" rel="noopener">
            {children}
          </a>
        );
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
            {value.quotePerson ? (
              <span className="content-quote-person">
                &#8212; {value.quotePerson}
              </span>
            ) : (
              ""
            )}
          </div>
        );
      },
      contentRow: ({ value }) => {
        if ("contentRowItem" in value) {
          const returnItemCount = (arrayLength) => {
            switch (arrayLength) {
              case 5:
                return "content-row-five";
                break;
              case 4:
                return "content-row-four";
                break;
              case 3:
                return "content-row-three";
                break;
              case 2:
                return "content-row-two";
                break;
              case 1:
                return "content-row-one";
                break;
              default:
                return "content-row-one";
            }
          };
          const pushToLightbox = () => {
            value.contentRowItem.map((item) => {
              if (item.hasOwnProperty("image")) {
                addToImages(item.image);
              }
            });
          };
          pushToLightbox();
          const contentRowLength = value.contentRowItem.length;
          return (
            <div className="content-row-wrapper">
              <div
                className={`content-row ${returnItemCount(contentRowLength)}`}
              >
                {value.contentRowItem.map((item, index) => {
                  if (item.hasOwnProperty("image")) {
                    return (
                      <div
                        key={"cri" + item._key}
                        className="content-row-image-wrapper"
                      >
                        <div className="content-row-image">
                          <img
                            width={window.innerWidth}
                            src={urlFor(item.image)
                              .width(
                                isNarrow
                                  ? Math.round(window.innerWidth * 2)
                                  : Math.round(window.innerWidth)
                              )
                              .url()}
                            onClick={() => {
                              setFullscreenImage(item.image);
                            }}
                          />
                        </div>

                        <div className="content-row-image-caption">
                          <PortableText value={item.image.caption} />
                        </div>
                      </div>
                    );
                  } else if (item.hasOwnProperty("quote")) {
                    //quote
                    return (
                      <div
                        key={"crq" + item._key}
                        className="content-row-quote-wrapper"
                      >
                        <span className="content-row-quote">
                          &ldquo;
                          <PortableText value={item.quote} />
                          &rdquo;
                        </span>
                        <span className="content-row-quote-person">
                          &#8212; {item.quotePerson}
                        </span>
                      </div>
                    );
                  } else if (item.hasOwnProperty("video")) {
                    return (
                      <div
                        key={"crv" + item._key}
                        className="content-row-video-wrapper"
                      >
                        <SingleVideoPlayer
                          thumbnail={
                            "thumbnail" in item ? item.thumbnail : null
                          }
                          assetDocument={item.videoAsset}
                        />
                      </div>
                    );
                  } else if (item.hasOwnProperty("embed")) {
                    const returnContentWidth = () => {
                      if (isNarrow) {
                        return "100%";
                      }
                      if (contentRowLength == 1) {
                        return window.innerWidth / 2;
                      } else if (contentRowLength == 2) {
                        return window.innerWidth / 2 / 2 - 40;
                      } else if (contentRowLength == 3) {
                        return window.innerWidth / 1.333 / 3 - 40;
                      } else {
                        return window.innerWidth / contentRowLength - 40;
                      }
                    };
                    if (item.embed.includes("https://www.instagram.com")) {
                      let IGcode1 = item.embed.replace("?", " ");
                      let IGcode2 = IGcode1.match(/(https?:\/\/[^ ]*)/)[0];
                      return (
                        <>
                          <div
                            key={"embed" + item._key}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <InstagramEmbed
                              url={IGcode2}
                              width={returnContentWidth()}
                            />
                          </div>
                        </>
                      );
                    } else if (item.embed.includes("https://twitter.com")) {
                      let TwitterCode = item.embed.replace("?", " ");
                      let TwitterCode1 = TwitterCode.replace('"', " ");
                      let TwitterCode2 =
                        TwitterCode1.match(/(https?:\/\/[^ ]*)/)[0];
                      return (
                        <>
                          <div
                            key={"embed" + item._key}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <TwitterEmbed
                              url={TwitterCode2}
                              width={returnContentWidth()}
                            />
                          </div>
                        </>
                      );
                    } else if (item.embed.includes("https://www.tiktok.com")) {
                      let TikTokCode = item.embed.replace("?", " ");
                      let TikTokCode1 = TikTokCode.replace('"', " ");
                      let TikTokCode2 =
                        TikTokCode1.match(/(https?:\/\/[^ ]*)/)[0];
                      let TikTokCode3 = TikTokCode2.replace('"', "");
                      return (
                        <>
                          <div
                            key={"embed" + item._key}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <TikTokEmbed
                              url={TikTokCode3}
                              width={returnContentWidth()}
                            />
                          </div>
                        </>
                      );
                    } else if (
                      item.embed.includes("https://www.youtube.com") ||
                      item.embed.includes("https://www.youtu.be")
                    ) {
                      let YouTubeCode1 = item.embed.replace('"', " ");
                      let YouTubeCode2 =
                        YouTubeCode1.match(/(https?:\/\/[^ ]*)/)[0];
                      let YouTubeCode3 = YouTubeCode2.replace(
                        "https://www.youtube.com/embed/",
                        "https://www.youtube.com/watch?v="
                      ).replace('"', " ");

                      return (
                        <ReactPlayer
                          key={"embed" + item._key}
                          url={YouTubeCode3}
                          width={returnContentWidth()}
                        />
                      );
                    } else if (
                      item.embed.includes("https://player.vimeo.com")
                    ) {
                      let VimeoCode1 = item.embed.replace('"', " ");
                      let VimeoCode2 = VimeoCode1.replace("?", " ");
                      let VimeoCode3 =
                        VimeoCode2.match(/(https?:\/\/[^ ]*)/)[0];

                      let VimeoCode4 = VimeoCode3.replace(
                        "https://player.vimeo.com/video/",
                        "https://vimeo.com/"
                      );
                      return (
                        <ReactPlayer
                          key={"embed" + item._key}
                          url={VimeoCode4}
                          controls={true}
                          width={returnContentWidth()}
                        />
                      );
                    } else if (item.embed.includes("https://soundcloud.com")) {
                      let SoundCloudCode1 = item.embed.match(
                        /(?:https?:\/\/)?(?:www\.)?(?:[\da-z-]+\.)+[a-z]{2,10}(?:\/[^\s/]+)*\/?\s/gi
                      );
                      let SoundCloudCode2 = SoundCloudCode1[
                        SoundCloudCode1.length - 1
                      ].replace('"', "");
                      let SoundCloudCode3 = SoundCloudCode2.replace(" ", "");
                      return (
                        <ReactPlayer
                          key={"embed" + item._key}
                          url={SoundCloudCode3}
                          width={returnContentWidth()}
                        />
                      );
                    } else {
                      return (
                        <div dangerouslySetInnerHTML={{ __html: item.embed }} />
                      );
                    }
                  }
                })}
              </div>
            </div>
          );
        } else {
          return null;
        }
      },
    },
    marks: {
      em: ({ children }) => {
        return <em>{children}</em>;
      },
      strong: ({ children }) => {
        return <strong>{children}</strong>;
      },
      link: ({ children, value }) => {
        const rel = !value.href.startsWith("/")
          ? "noreferrer noopener"
          : undefined;
        return (
          <a href={value.href} target="_blank" rel={rel}>
            {children}
          </a>
        );
      },
      footnote: ({ value }) => {
        addToFootnotes(value);
        return <span className="footnote-indicator">{footnotes.length}</span>;
      },
    },
  };

  useEffect(() => {
    if (localStorage.marketing == "true") {
      toggleAllowTracking(true);
    }
  }, [localStorage]);

  if (showErrorPage) return <Page404 />;
  if (!pageContent) return <></>;
  return (
    <div
      className={`article ${
        pageContent._type == "researchreality" ? "article-rr" : ""
      }`}
    >
      <SlideshowCursor />

      {fullscreenImage && fullscreenImages ? (
        <DAMNlightbox
          images={fullscreenImages}
          currentImage={fullscreenImage}
          setCurrentImage={setFullscreenImage}
        />
      ) : (
        ""
      )}

      {!isNarrow ? (
        <Menu />
      ) : (
        <MenuMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}

      {"trackingCode" in pageContent
        ? returnInsetIframeHTML(pageContent.trackingCode)
        : ""}
      <div className="article-content-wrapper">
        <div className="article-text-column">
          <div className="article-text-column-article-type">
            {returnMetaNavigation(pageContent._type, pageContent.tags[0])}
          </div>
          <div className="article-text-column-title">
            {returnFormattedTitle(pageContent.title)}
          </div>
          <div className="article-meta-column">
            {pageContent.author[0] !== undefined ? (
              <>
                <a
                  className="saturated-link"
                  href={`/author/${pageContent.author[0].title}`}
                >
                  {pageContent.author[0].title}
                </a>
                <br />
              </>
            ) : (
              ""
            )}
            {pageContent.issue.length !== 0 ? (
              <a
                className="saturated-link"
                href={"/issue-search/" + pageContent.issue[0].number}
              >
                DAMNº{pageContent.issue[0].number}
              </a>
            ) : (
              ""
            )}{" "}
            {pageContent.meta}
          </div>
        </div>
        {"slideshow" in pageContent ? (
          pageContent.slideshow.length == 1 ? (
            <div className="article-single-highlight">
              {pageContent.slideshow[0].asset._type == "sanity.imageAsset" ? (
                <>
                  <div className="article-single-image">
                    <img
                      src={urlFor(pageContent.slideshow[0].asset._id)
                        .width(Math.round(window.innerWidth))
                        .url()}
                      onClick={() => {
                        setFullscreenImage(pageContent.slideshow[0]);
                      }}
                    />
                  </div>
                  <div className="article-single-image-caption">
                    <PortableText value={pageContent.slideshow[0].caption} />
                  </div>
                </>
              ) : (
                <SingleVideoPlayer
                  className="article-single-video"
                  assetDocument={pageContent.slideshow[0].asset}
                  aspectRatio={pageContent.slideshow[0].asset.data.aspect_ratio}
                />
              )}
            </div>
          ) : (
            <div className="article-image-slider">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: navigationPrevRef.current,
                  nextEl: navigationNextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = navigationPrevRef.current;
                  swiper.params.navigation.nextEl = navigationNextRef.current;
                }}
                slidesPerView={"auto"}
                spaceBetween={0}
                loop={true}
                className="mySwiper"
                autoHeight={true}
              >
                <div
                  className="swiper-ref-prev"
                  ref={navigationPrevRef}
                  onMouseEnter={() => cursorChangeHandler("previous")}
                  onMouseLeave={() => cursorChangeHandler("")}
                />
                <div
                  className="swiper-ref-next"
                  ref={navigationNextRef}
                  onMouseEnter={() => cursorChangeHandler("next")}
                  onMouseLeave={() => cursorChangeHandler("")}
                />

                {pageContent.slideshow.map((slide, index) => {
                  return (
                    <>
                      {slide._type == "image" ? (
                        <SwiperSlide
                          key={"slide" + index}
                          style={{ width: returnImageWidth(slide.asset._id) }}
                        >
                          <div className="article-image-slider-wrapper">
                            <img
                              src={urlFor(slide.asset._id)
                                .height(Math.round(window.innerHeight))
                                .url()}
                              onClick={() => {
                                setFullscreenImage(slide);
                              }}
                            />
                          </div>
                          <div className="article-image-slider-caption">
                            <PortableText value={slide.caption} />
                          </div>
                        </SwiperSlide>
                      ) : (
                        <SwiperSlide
                          key={"slide" + index}
                          style={{
                            width: returnVideoWidth(
                              slide.asset.data.aspect_ratio
                            ),
                            height: returnVideoHeight(
                              slide.asset.data.aspect_ratio
                            ),
                          }}
                        >
                          <SingleVideoPlayer
                            className="swiper-video"
                            assetDocument={slide.asset}
                            aspectRatio={slide.asset.data.aspect_ratio}
                          />
                        </SwiperSlide>
                      )}
                    </>
                  );
                })}
              </Swiper>
            </div>
          )
        ) : (
          // If no slideshow, only highlight
          <div className="article-single-highlight">
            {pageContent.highlightItem[0].asset._type == "sanity.imageAsset" ? (
              <>
                <div className="article-single-image">
                  <img
                    src={urlFor(pageContent.highlightItem[0].asset._id)
                      .width(Math.round(window.innerWidth))
                      .url()}
                    onClick={() => {
                      setFullscreenImage(pageContent.slideshow[0]);
                    }}
                  />
                </div>
                <div className="article-single-image-caption"></div>
              </>
            ) : (
              <SingleVideoPlayer
                className="article-single-video"
                assetDocument={pageContent.highlightItem[0].asset}
                aspectRatio={
                  pageContent.highlightItem[0].asset.data.aspect_ratio
                }
              />
            )}
          </div>
        )}
        <div className="article-text-column">
          <div className="article-text-column-content">
            <PortableText
              value={convertQuotationMarks(pageContent.text)}
              components={articleTextComponents}
            />
          </div>
          {footnotesArray ? (
            <div className="article-text-column-footnotes">
              <div className="footnote-label">Notes</div>

              {footnotesArray.map((footnote, index) => {
                return (
                  <div key={"foonote" + index} className="footnote-wrapper">
                    <span className="footnote-number">{index + 1}</span>
                    <PortableText
                      value={footnote.content}
                      // components={footnoteComponents}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
          {pageContent.author[0] !== undefined ? (
            <div className="article-text-column-author-bio">
              <PortableText
                value={pageContent.author[0].text}
                // components={footnoteComponents}
              />
            </div>
          ) : (
            ""
          )}
          {pageAd && pageContent._type == "article" ? (
            <div className="ad-image-wrapper">
              {/* {console.log(pageAd)} */}
              {"articleAd" in pageAd ? (
                <>
                  <a href={pageAd.articleAd.url}>
                    <img
                      src={urlFor(pageAd.articleAd.image)
                        .width(Math.round(window.innerWidth))
                        .url()}
                    />
                  </a>
                  {"trackingCode" in pageAd.articleAd
                    ? returnInsetIframeHTML(pageAd.articleAd.trackingCode)
                    : ""}
                </>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          <div className="article-bottom-meta-column">
            {pageContent.tags[0] !== null ? (
              <div className="article-meta-column-tags">
                <div className="title">TAGS</div>
                <div className="meta-tags-list">
                  {pageContent.tags[0].map((tag, index) => {
                    return (
                      <span
                        className="theme-color"
                        key={"tags" + index}
                        onClick={() => {
                          navigate("/tag/" + tag.label);
                        }}
                      >
                        {tag.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="article-meta-column-share">
              <span className="title">SHARE</span>
              <div className="article-meta-column-share-buttons">
                <span className="meta-mail-icon theme-color-stroke">
                  {/* <a href=""><HiOutlineMail/></a> */}
                  <a
                    href={`mailto:?subject=From DAMN° Magazine&body=From DAMN° Magazine:%0A%0A${
                      pageContent.title
                    }%0A${
                      pageContent.author.length > 0
                        ? pageContent.author[0].title
                        : ""
                    }%0A https://damnmagazine.net/${pageContent.slug.current}`}
                    title="Share by Email"
                  >
                    <HiOutlineMail />
                  </a>
                </span>
                <FacebookShareButton
                  url={`https://damnmagazine.net/${pageContent.slug.current}`}
                >
                  <span className="theme-color-fill">
                    <FaFacebookSquare />
                  </span>
                </FacebookShareButton>
                <TwitterShareButton
                  url={`https://damnmagazine.net/${pageContent.slug.current}`}
                >
                  <span className="theme-color-fill">
                    <FaTwitterSquare />
                  </span>
                </TwitterShareButton>
                {/* <a target='_blank' href="https://www.facebook.com/damnmagazine.net/"><span className="theme-color-fill"><FaFacebookSquare/></span></a> */}
                {/* <a target='_blank' href="https://www.instagram.com/damn_magazine/"><span className="theme-color-fill"><FaInstagramSquare/></span></a> */}
              </div>
            </div>
            <div className="article-meta-column-buy">
              <a
                href="https://www.idecommedia.be/Abo_Pagina/Abonneer?Owner=DAMN&Brand=DAMN&ID=C7F239D5-E5EE-4567-8448-44B33B27A461"
                target="_blank"
              >
                BUY ISSUE
              </a>
            </div>
            <div className="article-meta-column-newsletter">
              <span
                className="title pointer theme-color"
                onClick={() => toggleNewsletterShowing(!newsletterShowing)}
              >
                SIGN-UP FOR NEWSLETTER
              </span>
              <div
                className={`article-meta-column-newsletter-wrapper ${
                  newsletterShowing ? "display" : ""
                }`}
              >
                <NewsletterSubscribe />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="article-footer-wrapper">
        <Footer type={returnFooterType()} />
      </div>
    </div>
  );
};

export default Article;
