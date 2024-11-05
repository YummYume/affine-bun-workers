import { logger } from '@bogeychan/elysia-logger';
import { cors } from '@elysiajs/cors';
import { Elysia, t } from 'elysia';
import { helmet } from 'elysia-helmet';

import { proxyImage } from './utils/image-proxy';
import { getLinkPreviewMetadata } from './utils/link-preview';

export const ELYSIA_ALLOWED_ORIGINS = Bun.env.ELYSIA_ALLOWED_ORIGINS?.split(',') ?? [];
export const ELYSIA_PORT = Number.parseInt(Bun.env.ELYSIA_PORT ?? '3000');
export const ELYSIA_PREFIX = Bun.env.ELYSIA_PREFIX;
export const ELYSIA_LOGGER_LEVEL = Bun.env.ELYSIA_LOGGER_LEVEL ?? 'debug';

export const app = new Elysia({ prefix: ELYSIA_PREFIX })
  .use(
    logger({
      level: ELYSIA_LOGGER_LEVEL,
    }),
  )
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get('origin');

        if (!origin) {
          return false;
        }

        return ELYSIA_ALLOWED_ORIGINS.includes(origin);
      },
    }),
  )
  .use(helmet())
  .guard({
    body: t.Object({
      url: t.String({ format: 'uri' }),
    }),
  })
  .post('/link-preview', async ({ body, log }) => {
    log.info('Fetching link preview metadata with URL "%s".', body.url);

    return getLinkPreviewMetadata(body.url);
  })
  .post('/image-proxy', async ({ body, request, set, log }) => {
    const acceptFormat = request.headers.get('accept') ?? '';
    const format = /image\/avif/.test(acceptFormat) ? 'avif' : 'webp';
    const imageResponse = await fetch(body.url);

    if (!imageResponse.ok) {
      set.status = 400;

      return {
        error: 'The image could not be fetched.',
      };
    }

    const contentType = imageResponse.headers.get('content-type');

    if (!contentType?.startsWith('image/')) {
      set.status = 400;

      return {
        error: 'The URL provided does not seem to be an image.',
      };
    }

    log.info('Proxying image with URL "%s" and format "%s".', body.url, format);

    // TODO: Stream this response
    return proxyImage(await imageResponse.arrayBuffer(), format);
  });

app.listen(ELYSIA_PORT);

console.log(`AFFiNE workers are running at ${app.server?.hostname}:${app.server?.port}`);
