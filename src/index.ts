import { getLinkPreviewMetadata } from "./utils/link-preview";
import { getUrlFromRequest } from "./utils/request";

Bun.serve({
  development: Bun.env.NODE_ENV === 'development',
  fetch: async (req) => {
    const url = new URL(req.url);

    // Only allow POST requests
    if (req.method === 'POST') {
      if (url.pathname === '/api/worker/link-preview') {
        const url = await getUrlFromRequest(req);
        const preview = await getLinkPreviewMetadata(url);

        return Response.json(preview);
      }

      if (url.pathname === '/api/worker/image-proxy') {
        const url = await getUrlFromRequest(req);
        const response = await fetch(url);

        // TODO validations + stream this ?
        return response;
      }
    }

    return new Response('Not found', {
      status: 404,
    });
  },
});
