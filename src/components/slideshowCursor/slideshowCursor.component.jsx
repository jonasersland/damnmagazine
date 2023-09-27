import React, { useContext } from "react";
import "./slideshowCursor.styles.scss";
import useMousePosition from "../../hooks/useMousePosition";
import { GlobalContext } from "../../context/global-context";

import { BsArrowRight } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";

const SlideshowCursor = () => {
  const { cursorType, cursorChangeHandler } = useContext(GlobalContext);
  const { x, y } = useMousePosition();

  if (!cursorType) return <span className="no-cursor"></span>;
  return (
    <>
      {cursorType == "next" ? (
        <div
          className={"cursor-next"}
          style={{ left: `${x}px`, top: `${y}px` }}
        >
          <span className="label">NEXT</span>{" "}
          <span className="arrow-wrapper">
            <BsArrowRight />
          </span>
        </div>
      ) : cursorType == "previous" ? (
        <div
          className={"cursor-previous"}
          style={{ left: `${x}px`, top: `${y}px` }}
        >
          <span className="arrow-wrapper">
            <BsArrowLeft />
          </span>{" "}
          PREVIOUS
        </div>
      ) : (
        <span className="no-cursor"></span>
      )}
    </>
  );
};

export default SlideshowCursor;
