/* eslint-disable max-len */
import mixpanel from 'mixpanel-browser';

type EventName = 'Emblem SDK Mounted' | 'Emblem QR Code Mounted' | 'Emblem Button Mounted' | 'Emblem Button Click'

interface EventTrackProps {
  event: EventName;
  emblemState: string;
  projectKey: string;
}

class WrappedMixpanelClient {
  /** Allows direct use of the mixpanel api */
  private readonly api: typeof mixpanel;
  private initialized: boolean;

  constructor() {
    this.api = mixpanel;
    this.initialized = false;
  }

  public init(emblemState: string) {
    if (this.initialized) return;
    this.api.init('8ca2fc033bd384966bfe3ba6c035a7ae');
    this.api.identify(emblemState);
    this.initialized = true;
  }

  public trackEvent({ event, ...others }: EventTrackProps) {
    if (!this.initialized) {
      this.init(others.emblemState);
    };
    this.api.track(event, { ...others });
  }
}

/**
 * Wraps the mixpanel api to provide app-specific typing to event and user properties
 * with some custom methods.
 */
const client = new WrappedMixpanelClient();

export default client;
