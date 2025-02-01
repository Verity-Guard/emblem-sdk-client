export interface EmblemQueryParams {
  projectKey: string;
  emblemState: string;
  reviewRedirectUrl?: string;
  postbackUrl?: string;
  postbackHeaders?: string;
  postbackOverride?: boolean;
}

interface EmblemProps {
  url: string;
  projectKey: string;
  state: string;
  reviewRedirectUrl?: string;
  postbackUrl?: string;
  postbackHeaders?: string;
  postbackOverride?: boolean;
  assignCloseWindow?: (closeFn: () => void) => void;
  login?: boolean;
}

export default EmblemProps;
