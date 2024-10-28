import { JSDOM } from 'jsdom';
import { fixUrl } from '../utils/url';

const appendUrl = (url: string | null, array?: string[]) => {
	if (url) {
		const fixedUrl = fixUrl(url);

		if (fixedUrl) {
			array?.push(fixedUrl.toString());
		}
	}
}

/**
 * Fetches the metadata of a URL and returns a preview object.
 *
 * @param requestUrl The URL to fetch metadata from.
 * @returns The metadata of the URL. If the URL is determined to be an image, it will simply return a preview to the image.
 */
export const getLinkPreviewMetadata = async (requestUrl: string) => {
  const targetURL = fixUrl(requestUrl);

  if (!targetURL) {
    throw new Error('Invalid URL for preview');
  }

  const response = await fetch(targetURL.href);

  // if the response is an image, we can return early
  if (response.headers.get('content-type')?.startsWith('image/')) {
    return {
      url: targetURL.toString(),
      images: [targetURL.toString()],
      videos: [] as string[],
      favicons: [] as string[],
      title: targetURL.toString(),
      siteName: targetURL.hostname,
      description: '',
      mediaType: response.headers.get('content-type'),
    };
  }

  const html = await response.text();
  const dom = new JSDOM(html);

  const res = {
    url: targetURL.toString(),
    images: [] as string[],
    videos: [] as string[],
    favicons: [] as string[],
    title: '',
    siteName: '',
    description: '',
    mediaType: '',
  };

  dom.window.document.querySelectorAll('meta').forEach(tag => {
    const property = tag.getAttribute('property') || tag.getAttribute('name');
    const content = tag.getAttribute('content');

    if (property && content) {
      switch (property.toLowerCase()) {
        case 'og:title': res.title = content; break;
        case 'og:site_name': res.siteName = content; break;
        case 'og:description': res.description = content; break;
        case 'og:image': appendUrl(content, res.images); break;
        case 'og:video': appendUrl(content, res.videos); break;
        case 'og:type': res.mediaType = content; break;
        case 'description': if (!res.description) res.description = content; break;
      }
    }
  });

  res.title = res.title || dom.window.document.querySelector('title')?.textContent || '';

  dom.window.document.querySelectorAll('link[rel*="icon"]').forEach(link => {
    const href = link.getAttribute('href');

    if (href) appendUrl(href, res.favicons);
  });

  // get favicon by looking for the root domain and appending /favicon.ico
  if (!res.favicons.length) {
    const rootDomain = targetURL.protocol + '//' + targetURL.hostname;

    appendUrl(rootDomain + '/favicon.ico', res.favicons);
  }

  dom.window.document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');

    if (src) appendUrl(src, res.images);
  });

  dom.window.document.querySelectorAll('video').forEach(video => {
    const src = video.getAttribute('src');

    if (src) appendUrl(src, res.videos);
  });

  return res;
}
