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
  spinnerColor?: string;
  className?: string;
  assignCloseWindow?: (closeFunc: () => void) => void;
}

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

  const handleOnClick = () => {
    mixpanel.trackEvent({ event: 'Emblem Button Click', emblemState: state, projectKey });
    if (onSuccessUrl) {
      onClickCallback?.();
      return window.location.href = emblemRedirectRoute;
    }
    if (isButton && isBrowser) {
      const newWindow = window.open(
        emblemRedirectRoute,
        "verify-age-window",
        "width=380,height=800"
      );
      setChildWindow(newWindow);
    }
    onClickCallback?.();
  };

  return (
    <Component
      type="button"
      onClick={handleOnClick}
      style={valid ? style : disabledStyle}
      className={className}
      disabled={!valid}
      {...(!isButton && { href: emblemRedirectRoute, target: onSuccessUrl ? undefined : '_blank' })}
    >
      {label}
    </Component>
  );
}

export default EmblemButton;