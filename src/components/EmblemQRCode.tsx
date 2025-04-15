import React, { useEffect, useRef, useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import QRCode from 'qrcode';
import QRCodeFrame from './QRCodeFrame';
import EmblemProps from '../types';
import createEmblemUrl from '../utils/createEmblemUrl';
import mixpanel from '../mixpanel';
import validateProps from "../validateProps";

const onError = (error: Error | null | undefined) => {
  if (error) console.error(error);
};

function EmblemQRCode({
  url,
  projectKey,
  state,
  login,
  postbackUrl = "",
  postbackHeaders = "",
  postbackOverride = false,
  onSuccessUrl = "",
}: EmblemProps) {
  const valid = validateProps({ url, projectKey, state, postbackUrl, postbackHeaders, postbackOverride });

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!state || !projectKey) return;
    mixpanel.trackEvent({ event: 'Emblem QR Code Mounted', emblemState: state, projectKey });
  }, [state, projectKey]);

  useEffect(() => {
    const params = {
      projectKey,
      emblemState: state,
      postbackUrl,
      postbackHeaders,
      postbackOverride: postbackOverride ? true : undefined,
      onSuccessUrl,
    };
    const urlString = createEmblemUrl(url, params, true, !!login);
    if (canvasRef.current && url && projectKey && state) {
      QRCode.toCanvas(canvasRef.current, urlString, { width: 220 }, onError);
    }
  }, [url, projectKey, state]);

  const svgString = encodeURIComponent(renderToStaticMarkup(<QRCodeFrame />));
  const dataUri = `url("data:image/svg+xml,${svgString}")`;

  return (
    <div
      className="flex self-center"
      style={{ background: dataUri, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
    >
      {valid && (
        <div className="align-middle self-center m-6">
          <canvas ref={canvasRef} />
        </div>
      )}

    </div>
  );
}

export default EmblemQRCode;
