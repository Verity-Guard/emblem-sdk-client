import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import EmblemProps from "../types";
import validateProps from "../validateProps";
import { isIOSSafari } from "../utils/browser";
import mixpanel from "../mixpanel";
import createEmblemUrl from "../utils/createEmblemUrl";

export interface EmblemButtonProps extends EmblemProps {
  label?: string;
  style?: CSSProperties;
  onClickCallback?: () => void;
  className?: string;
  assignCloseWindow?: (closeFunc: () => void) => void;
  openInNewTab?: boolean;
}

const NEW_WINDOW_DIMS = 'width=840,height=850';

function EmblemButton({
  url,
  projectKey,
  state,
  label = "Verify 18+",
  style = {},
  postbackUrl = "",
  postbackHeaders = "",
  postbackOverride = false,
  onSuccessUrl = "",
  login = false,
  onClickCallback,
  className = "",
  assignCloseWindow,
  openInNewTab = false,
}: EmblemButtonProps) {
  const isBrowser = typeof window !== "undefined";
  const valid = validateProps({ url, projectKey, state, postbackUrl, postbackHeaders, postbackOverride });

  const [childWindow, setChildWindow] = useState<Window | null>(null);

  useEffect(() => {
    if (!state || !projectKey) return;
    mixpanel.trackEvent({ event: 'Emblem Button Mounted', emblemState: state, projectKey });
  }, [state, projectKey]);

  useEffect(() => {
    if (assignCloseWindow && childWindow) {
      // Create a close function that closes the child window
      const closeFunc = () => {
        if (childWindow && !childWindow.closed) {
          childWindow.close();
        }
      }
      // Pass the close function back to the implementer
      assignCloseWindow(closeFunc);
    }
  }, [childWindow, assignCloseWindow]);

  const Component = useMemo(() => {
    if (!isBrowser) {
      return "button"; // Default to "button" server-side
    }
    return isIOSSafari() ? "a" : "button";
  }, [isBrowser]);

  const isButton = Component === 'button';
  const isLink = Component === 'a';

  const emblemRedirectRoute = useMemo(() => {
    const params = {
      projectKey,
      emblemState: state,
      postbackUrl,
      postbackHeaders,
      postbackOverride: postbackOverride ? true : undefined,
      onSuccessUrl,
    };

    return createEmblemUrl(url, params, false, login);
  }, [projectKey, state, url, postbackUrl, postbackHeaders, postbackOverride, onSuccessUrl, login]);

  const disabledStyle = {
    ...style,
    cursor: "not-allowed",
    backgroundColor: "#ccc",
  };

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!valid) {
      // If it's an invalid link, prevent default navigation.
      // Buttons are handled by the 'disabled' attribute.
      if (isLink) {
        event.preventDefault();
      }
      return true;
    }

    mixpanel.trackEvent({ event: 'Emblem Button Click', emblemState: state, projectKey });

    // Handle window/tab opening in browser
    if (isBrowser) {
      // Handle full page redirect first
      if (onSuccessUrl) {
        onClickCallback?.();
        window.location.href = emblemRedirectRoute;
        return true;
      }
      if (openInNewTab) {
        // --- Open in New Tab ---
        // For <a> tags, the default behavior + target="_blank" handles it.
        // For <button>, we explicitly open the tab.
        if (isButton) {
          window.open(emblemRedirectRoute, '_blank');
        }
        setChildWindow(null); // Not managing a specific window in this case
      } else {
        // Prevent default for <a> tags if we're opening a popup manually
        if (isLink) {
          event.preventDefault();
        }
        const newWindow = window.open(
          emblemRedirectRoute,
          "verify-age-window",
          NEW_WINDOW_DIMS
        );
        setChildWindow(newWindow);
      }
    }
    // Call the generic callback
    onClickCallback?.();

    return true;
  };

  // Determine target for the <a> tag variant
  const linkTarget = !onSuccessUrl && openInNewTab ? '_blank' : undefined;

  return (
    <Component
      style={valid ? style : disabledStyle}
      className={className}
      onClick={handleOnClick}
      // Button specific props
      {...(isButton && { type: "button", disabled: !valid })}
      // Link specific props
      {...(isLink && {
        href: valid ? emblemRedirectRoute : undefined,
        target: linkTarget,
        // Add rel for security when target is _blank
        ...(linkTarget === '_blank' && { rel: 'noopener noreferrer' }),
      })}
    >
      {label}
    </Component>
  );
}

export default EmblemButton;