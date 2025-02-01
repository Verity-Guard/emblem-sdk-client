import { EmblemQueryParams } from '../types';

function createEmblemUrl(
  emblemHost: string,
  queryParams: EmblemQueryParams,
  qr: boolean,
  login: boolean,
) {
  // Filter empty strings from query params
  const search = Object.entries(queryParams).reduce((acc, [key, value]) => {
    if (value) acc.append(key, value);
    return acc;
  }, new URLSearchParams());

  if (qr) search.set('qr', 'true');
  if (login) search.set('login', 'true');

  const urlString = `${emblemHost}/redirect?${search.toString()}`;
  return urlString;
}

export default createEmblemUrl;
