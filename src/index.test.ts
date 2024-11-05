import { describe, expect, it } from 'bun:test';

import { app } from '.';

describe('/link-preview', () => {
  it('fails with a wrong URL', async () => {
    const response = await app.handle(
      new Request('http://localhost/link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'not-a-url' }),
      }),
    );
    const responseBody = await response.json();

    expect(response.status).toBe(422);
    expect(responseBody).toMatchObject({
      type: 'validation',
      on: 'body',
      property: '/url',
    });
  });

  it('fetches metadata for a valid URL', async () => {
    const response = await app.handle(
      new Request('http://localhost/link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'https://example.com/' }),
      }),
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({
      url: 'https://example.com/',
      title: 'Example Domain',
      description: '',
      favicons: ['https://example.com/favicon.ico'],
      images: [],
      mediaType: '',
      siteName: '',
      videos: [],
    });
  });
});

describe('/image-proxy', () => {
  it('fails with a wrong URL', async () => {
    const response = await app.handle(
      new Request('http://localhost/image-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'not-a-url' }),
      }),
    );
    const responseBody = await response.json();

    expect(response.status).toBe(422);
    expect(responseBody).toMatchObject({
      type: 'validation',
      on: 'body',
      property: '/url',
    });
  });

  it('proxies an image in webp', async () => {
    const response = await app.handle(
      new Request('http://localhost/image-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: 'https://fastly.picsum.photos/id/1026/200/300.jpg?hmac=Thvj4aJ_VnAGT6DKAcy1yTs100zlstJTyImDWphGDFI',
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/webp');
  });

  it('proxies an image in avif', async () => {
    const response = await app.handle(
      new Request('http://localhost/image-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'image/avif',
        },
        body: JSON.stringify({
          url: 'https://fastly.picsum.photos/id/1026/200/300.jpg?hmac=Thvj4aJ_VnAGT6DKAcy1yTs100zlstJTyImDWphGDFI',
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/avif');
  });
});
