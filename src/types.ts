export interface EmblemQueryParams {
  projectKey: string;
  emblemState: string;
  postbackUrl?: string;
  postbackHeaders?: string;
  postbackOverride?: boolean;
}

interface EmblemProps {
  url: string;
  projectKey: string;
  state: string;
  postbackUrl?: string;
  postbackHeaders?: string;
  postbackOverride?: boolean;
  onSuccessUrl?: string;
  assignCloseWindow?: (closeFn: () => void) => void;
  login?: boolean;
}

export default EmblemProps;
