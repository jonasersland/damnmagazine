import React, { useEffect, useState, useRef, useContext } from "react";
import "./fullscreenImage.styles.scss";

import sanityClient from "../../client.js";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { getImageDimensions } from "@sanity/asset-utils";

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

const FullscreenImage = ({ children }) => {
  // const aspect = getImageDimensions(children.props.id).aspectRatio;
  const [imageShowing, setImageShowing] = useState(false);

  return (
    <>
      <div
        className={`fullscreen-image-wrapper ${imageShowing ? "display" : ""}`}
        onClick={() => {
          setImageShowing(false);
        }}
      >
        <div className="fullscreen-content">
          <div className="fullscreen-image">
            <img
              src={urlFor(children.props.id).height(window.innerHeight).url()}
            />
          </div>
        </div>
        <div className="fullscreen-image-background"></div>
      </div>
      <div
        onClick={() => {
          setImageShowing(true);
        }}
      >
        {children}
      </div>
    </>
  );
};

export default FullscreenImage;
