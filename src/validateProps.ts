import EmblemProps from './types';

function validateProps(props: EmblemProps) {
  let isValid = true;

  // Required props
  if (!props.url || typeof props.url !== 'string') {
    console.error('Invalid props: missing required prop url');
    isValid = false;
  }

  if (!props.projectKey || typeof props.projectKey !== 'string') {
    console.error('Invalid props: missing required prop projectKey');
    isValid = false;
  }

  if (!props.state || typeof props.state !== 'string') {
    console.error('Invalid props: missing required prop state');
    isValid = false;
  }

  // Optional props
  if (!!props.postbackUrl && typeof props.postbackUrl !== 'string') {
    console.error('Invalid props: postbackUrl must be a string');
    isValid = false;
  }

  if (!!props.postbackHeaders && typeof props.postbackHeaders !== 'string') {
    console.error('Invalid props: postbackHeaders must be a string');
    isValid = false;
  }

  if (props.postbackOverride && typeof props.postbackOverride !== 'boolean') {
    console.error('Invalid props: postbackOverride must be a boolean');
    isValid = false;
  }

  return isValid;
}

export default validateProps;
