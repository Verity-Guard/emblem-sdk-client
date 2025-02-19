import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmblemQRCode from './EmblemQRCode';
import logo from '../images/emblem-logo.png';
import shield from '../images/shield.png';
import '../i18n/i18n';
import EmblemProps from '../types';
import '../styles/styles.css';
import createEmblemUrl from '../utils/createEmblemUrl';
import isMobileDevice from '../utils/isMobileDevice';
import mixpanel from '../mixpanel';
import EmblemButton, { EmblemButtonProps } from './EmblemButton';

interface EmblemInfoProps extends EmblemButtonProps {
  language?: string;
  login?: boolean;
}

function Emblem({
  url,
  projectKey,
  state,
  label = "Verify 18+",
  style = {},
  reviewRedirectUrl = "",
  postbackUrl = "",
  postbackHeaders = "",
  postbackOverride = false,
  onSuccessUrl = "",
  onClickCallback,
  assignCloseWindow,
  language = 'en',
  login = false,
}: EmblemInfoProps) {
  const [showQRCode, setShowQRCode] = useState(false);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    console.log('language', language)
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    if (!state || !projectKey) return;
    mixpanel.trackEvent({ event: 'Emblem SDK Mounted', emblemState: state, projectKey });
  }, [state, projectKey]);

  const params = {
    projectKey,
    emblemState: state,
    reviewRedirectUrl,
    postbackUrl,
    postbackHeaders,
    postbackOverride: postbackOverride ? true : undefined,
    onSuccessUrl,
  };

  const urlString = createEmblemUrl(url, params, true, login);
  const isMobile = isMobileDevice();
  return (
    <div className="emblem-container">
      <div className="emblem-left-col">
        <div style={{ height: '240px', width: '240px', marginBottom: '4rem' }}>
          <img
            src={shield}
            alt="Shield"
            style={{ height: '100%' }}
          />
        </div>
        <p style={{ marginBottom: '1rem' }}>{t('leftCol.notCollect')}</p>
        <p>{t('leftCol.proofOfAge')}</p>
      </div>
      <div className="emblem-right-col">
        {!showQRCode ? (
          <>
            <h1 className="emblem-h1 emblem-bold">{t('rightColIntro.title')}</h1>
            <div className="emblem-logo-container">
              <p className="emblem-xl-text emblem-bold">{t('rightColIntro.poweredBy')}</p>
              <div style={{ width: '150px' }}>
                <img src={logo} alt="Emblem Logo" style={{ width: '100%' }} />
              </div>
            </div>
            <p className="emblem-3xl-text emblem-semibold" style={{ marginBottom: '2rem' }}>{t('rightColIntro.stateLaw')}</p>
            <div style={{ marginBottom: '2rem', padding: '0 4rem' }}>
              <p className="mb-4">{t('rightColIntro.emblemPartner')}</p>
              <p>{t('rightColIntro.safeSimple')}</p>
            </div>

            {isMobile ? (
              <EmblemButton
                className="emblem-verify-now-button emblem-xl-text emblem-bold"
                projectKey={projectKey}
                state={state}
                url={url}
                label={label || t('rightColIntro.verifyNow')}
                assignCloseWindow={assignCloseWindow}
                onClickCallback={onClickCallback}
                style={style}
                reviewRedirectUrl={reviewRedirectUrl}
                postbackUrl={postbackUrl}
                postbackHeaders={postbackHeaders}
                postbackOverride={postbackOverride}
                onSuccessUrl={onSuccessUrl}
                login={login}
              />
            ) : (
              <button
                onClick={() => setShowQRCode(true)}
                className="emblem-verify-now-button emblem-xl-text emblem-bold"
              >
                {label || t('rightColIntro.verifyNow')}
              </button>
            )}
            <p className="emblem-xl-text emblem-bold">
              {t('rightColIntro.alreadyVerified')}
              {' '}
              <a href={urlString} className="emblem-login">
                {t('rightColIntro.login')}
              </a>
            </p>
          </>
        ) : (
          <>
            <h1 className="emblem-h1 emblem-bold">{t('rightColQR.switchToMobile')}</h1>
            <p className="emblem-bold">{t('rightColQR.verificationRequires')}</p>
            <div className="emblem-qr-code-container">
              <EmblemQRCode
                url={url}
                state={state}
                projectKey={projectKey}
                reviewRedirectUrl={reviewRedirectUrl}
                postbackUrl={postbackUrl}
                postbackHeaders={postbackHeaders}
                postbackOverride={postbackOverride}
                onSuccessUrl={onSuccessUrl}
                login={login}
              />
            </div>
            <div className="emblem-instruction-container emblem-xl-text">
              <p>{t('rightColQR.howToContinue')}</p>
              <ol>
                <li>{t('rightColQR.one')}</li>
                <li>{t('rightColQR.two')}</li>
                <li>{t('rightColQR.three')}</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Emblem;
