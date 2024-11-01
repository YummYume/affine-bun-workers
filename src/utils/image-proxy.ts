import sharp from 'sharp';

/**
 * Proxy an image from a URL and convert it to WebP or AVIF.
 *
 * @param requestUrl The URL of the image to proxy.
 * @param format The format to convert the image to.
 * @returns The response with the resized image.
 */
export const proxyImage = async (image: ArrayBuffer, format: 'webp' | 'avif' = 'webp') => {
  const resizer = sharp(image).resize({
    width: 1280,
    fit: 'contain',
  });

  if (format === 'webp') {
    resizer.webp();
  } else {
    resizer.avif();
  }

  return new Response(await resizer.toBuffer(), {
    headers: {
      'Content-Type': `image/${format}`,
    },
  });
};
