import React, { useEffect, useState, useRef, useContext } from "react";
import sanityClient from "../../client.js";
import "./cookies-popup.styles.scss";

import { PortableText } from "@portabletext/react";

const CookiesPopup = ({ localStorageSettings, setLocalStorageSettings }) => {
  const [expandedPreferences, toggleExpandedPreferences] = useState(false);

  const [content, setContent] = useState(null);

  const [statistic, setStatistic] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    let fetchContentQuery = `{'cookies':*[_type == 'cookies']{...}[0]}`;
    sanityClient
      .fetch(fetchContentQuery)
      .then((data) => {
        if (isMounted) {
          setContent(data);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  const setCookiePreferences = (settings) => {
    localStorage.setItem("cookiesPreferenceSet", true);
    localStorage.setItem("statistic", settings.statisticSettings);
    localStorage.setItem("marketing", settings.marketingSettings);

    setLocalStorageSettings({
      ...localStorageSettings,
      statistic: settings.statisticSettings,
      marketing: settings.marketingSettings,
      cookiesPreferenceSet: true,
    });
  };

  if (!content) return <></>;
  return (
    <div className="cookies-preference-wrapper">
      <div className="cookies-preference-init">
        <PortableText value={content.cookies.initialText} />
        <div className="cookies-buttons-wrapper">
          <div
            className="linklike theme-color"
            onClick={() =>
              setCookiePreferences({
                statisticSettings: true,
                marketingSettings: true,
              })
            }
          >
            YES, I ACCEPT
          </div>
          <div
            className="linklike theme-color"
            onClick={() => toggleExpandedPreferences(!expandedPreferences)}
          >
            MANAGE MY COOKIES
          </div>
        </div>
      </div>
      {expandedPreferences ? (
        <div className="cookies-preference-expanded">
          <div className="cookies-checkbox-wrapper">
            <div className="cookies-checkbox">
              <div className="cookies-checkbox-tick-wrapper">
                <input
                  type="checkbox"
                  onChange={(e) => setStatistic(e.target.checked)}
                  className="theme-color-bg"
                />
              </div>
              <div className="cookies-checkbox-label">STATISTIC COOKIES</div>
            </div>
            <div className="cookies-description">
              <PortableText value={content.cookies.statisticText} />
            </div>
          </div>

          <div className="cookies-checkbox-wrapper">
            <div className="cookies-checkbox">
              <div className="cookies-checkbox-tick-wrapper">
                <input
                  type="checkbox"
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="theme-color-bg"
                />
              </div>
              <div className="cookies-checkbox-label">MARKETING COOKIES</div>
            </div>
            <div className="cookies-description">
              <PortableText value={content.cookies.marketingText} />
            </div>
          </div>

          <div
            className="linklike theme-color"
            onClick={() =>
              setCookiePreferences({
                statisticSettings: statistic,
                marketingSettings: marketing,
              })
            }
          >
            ALLOW SELECTIONS
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CookiesPopup;
