import { JSDOM } from 'jsdom';

import { appendUrl } from '../utils/url';

/**
 * The data returned from the link preview API.
 */
export type ResponseData = {
  url: string;
  title?: string;
  siteName?: string;
  description?: string;
  images?: string[];
  mediaType?: string;
  contentType?: string;
  charset?: string;
  videos?: string[];
  favicons?: string[];
};

/**
 * Fetches the metadata of a URL and returns a preview object.
 *
 * @param requestUrl The URL to fetch metadata from.
 * @returns The metadata of the URL. If the URL is determined to be an image, it will simply return a preview to the image.
 */
export const getLinkPreviewMetadata = async (requestUrl: string): Promise<ResponseData> => {
  const targetURL = new URL(requestUrl);
  const response = await fetch(targetURL.href);

  // If the response is an image, we can return early
  if (response.headers.get('content-type')?.startsWith('image/')) {
    return {
      url: targetURL.toString(),
      images: [targetURL.toString()],
      videos: [],
      favicons: [],
      title: targetURL.toString(),
      siteName: targetURL.hostname,
      description: '',
      mediaType: response.headers.get('content-type') ?? undefined,
    };
  }

  // If the response is not HTML, we can return early
  if (!response.headers.get('content-type')?.startsWith('text/html')) {
    return {
      url: targetURL.toString(),
      images: [],
      videos: [],
      favicons: [],
      title: targetURL.toString(),
      siteName: targetURL.hostname,
      description: '',
      mediaType: response.headers.get('content-type') ?? undefined,
    };
  }

  const html = await response.text();
  const dom = new JSDOM(html);

  const res: ResponseData = {
    url: targetURL.toString(),
    images: [],
    videos: [],
    favicons: [],
    title: '',
    siteName: '',
    description: '',
    mediaType: '',
  };

  dom.window.document.querySelectorAll('meta').forEach((tag) => {
    const property = tag.getAttribute('property') || tag.getAttribute('name');
    const content = tag.getAttribute('content');

    if (property && content) {
      switch (property.toLowerCase()) {
        case 'og:title':
          res.title = content;

          break;
        case 'og:site_name':
          res.siteName = content;

          break;
        case 'og:description':
          res.description = content;

          break;
        case 'og:image':
          appendUrl(content, res.images);

          break;
        case 'og:video':
          appendUrl(content, res.videos);

          break;
        case 'og:type':
          res.mediaType = content;

          break;
        case 'description':
          if (!res.description) {
            res.description = content;
          }

          break;
      }
    }
  });

  res.title = res.title || dom.window.document.querySelector('title')?.textContent || '';

  dom.window.document.querySelectorAll('link[rel*="icon"]').forEach((link) => {
    const href = link.getAttribute('href');

    if (href) {
      appendUrl(href, res.favicons);
    }
  });

  // get favicon by looking for the root domain and appending /favicon.ico
  if (!res.favicons?.length) {
    const rootDomain = targetURL.protocol + '//' + targetURL.hostname;

    appendUrl(rootDomain + '/favicon.ico', res.favicons);
  }

  dom.window.document.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');

    if (src) {
      appendUrl(src, res.images);
    }
  });

  dom.window.document.querySelectorAll('video').forEach((video) => {
    const src = video.getAttribute('src');

    if (src) {
      appendUrl(src, res.videos);
    }
  });

  return res;
};
