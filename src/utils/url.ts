import { getDomain, getSubdomain } from 'tldts';

/**
 * Append a URL to an array if it is valid.
 *
 * @param {string | null} url The URL to append to the array.
 * @param {string[]} array The array to append the URL to.
 */
export const appendUrl = (url: string | null, array?: string[]) => {
  if (url) {
    const fixedUrl = fixUrl(url);

    if (fixedUrl) {
      array?.push(fixedUrl.toString());
    }
  }
};

/**
 * Fix a URL if it is not valid.
 *
 * @param {string} url The URL to fix.
 * @returns {URL | null} The fixed URL or null if the URL is invalid.
 */
export const fixUrl = (url: string): URL | null => {
  if (typeof url !== 'string') {
    return null;
  }

  let fullUrl = url;

  // Don't require // prefix, URL can handle protocol:domain
  if (!url.startsWith('http:') && !url.startsWith('https:')) {
    fullUrl = 'http://' + url;
  }

  try {
    const parsed = new URL(fullUrl);

    const subDomain = getSubdomain(url);
    const mainDomain = getDomain(url);
    const fullDomain = subDomain ? `${subDomain}.${mainDomain}` : mainDomain;

    // Check if the URL is valid and the domain is the same as the URL
    if (['http:', 'https:'].includes(parsed.protocol) && fullDomain === parsed.hostname) {
      return parsed;
    }
  } catch (_) {
    return null;
  }

  return null;
};
