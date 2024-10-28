/**
 * Get the URL POSTed to the request
 *
  * @param {Request} request The request to get the URL from.
  * @returns {string} The URL that was POSTed to the request. Will throw an error if the URL is not a string.
 */
export const getUrlFromRequest = async (request: Request) => {
  const { url } = await request.json();

  if (typeof url !== 'string') {
    throw new Error('Invalid URL');
  }

  return url;
}
