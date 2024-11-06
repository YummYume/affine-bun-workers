# AFFiNE Bun Workers

[![Linting](https://github.com/YummYume/affine-bun-workers/actions/workflows/linting.yml/badge.svg)](https://github.com/YummYume/affine-bun-workers/actions/workflows/linting.yml)
[![Testing](https://github.com/YummYume/affine-bun-workers/actions/workflows/testing.yml/badge.svg)](https://github.com/YummYume/affine-bun-workers/actions/workflows/testing.yml)
[![Publish image on Docker Hub](https://github.com/YummYume/affine-bun-workers/actions/workflows/publish.yml/badge.svg)](https://github.com/YummYume/affine-bun-workers/actions/workflows/publish.yml)

[AFFiNE](https://affine.pro) workers but for self-hosted Docker instances, using [Bun](https://bun.sh) and [Elysia](https://elysiajs.com).

## Content

- [AFFiNE Bun Workers](#affine-bun-workers)
  - [Content](#content)
  - [Why ?](#why-)
  - [Currently supported workers](#currently-supported-workers)
  - [Thanks](#thanks)
  - [Usage](#usage)
    - [Configuration](#configuration)
    - [Stripping or rewriting the prefix](#stripping-or-rewriting-the-prefix)
  - [Development](#development)

## Why ?

This repository serves for the development of workers for the self-hosted version of AFFiNE until a proper solution is added to the main repository.

The workers are basically a Bun server running and handling requests for proxying images and fetching metadata from a link.

This repository is NOT affiliated with AFFiNE in any way, it is just a temporary solution for self-hosted users.
It tries to replicate the workers from [AFFiNE](https://github.com/toeverything/affine-workers) as closely as possible.

## Currently supported workers

- [x] Image proxy (`/api/worker/image-proxy`)
- [x] Link preview (`/api/worker/link-preview`)

## Thanks

A big thanks to the AFFiNE team for creating such a great tool and to [eikaramba](https://github.com/eikaramba) for heavily inspiring this project
with their [work](https://github.com/eikaramba/affine-workers). Also a big thanks to Bun for simply existing.

## Usage

> [!NOTE]  
> This section assumes you are using the Docker image of AFFiNE and have an instance running.

Use [this Docker image](https://hub.docker.com/r/yummyume/affine-bun-workers) to run the workers.
Example in a classic compose file:

```yaml
services:
  workers:
    image: yummyume/affine-bun-workers
    restart: unless-stopped
    container_name: affine_workers

  # Other services, AFFiNE, Postgres, etc.
```

The workers will now be available on the port `3000` of the container.
The next step is to proxy requests from `/api/worker/*` to the workers container.

You can do this however you want, but here is an example using Caddy as a reverse proxy:

```caddy
https://my-website.com {
  reverse_proxy /api/worker/* workers:3000
  reverse_proxy * affine:3010
}
```

### Configuration

The following environment variables can be used on the service to configure the workers:

| Variable                 | Description                                                                                                                                                                 | Default       | Example                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------- |
| `NODE_ENV`               | The environment the workers are running in. You generally don't need to change this.                                                                                        | `production`  | `development`           |
| `ELYSIA_PORT`            | The port the workers will run on.                                                                                                                                           | `3000`        | `4000`                  |
| `ELYSIA_ALLOWED_ORIGINS` | The allowed origins for the workers (CORS). You can probably leave this empty if you use the same domain for everything. You can add multiple origins separated by a comma. |               | `affine.my-website.com` |
| `ELYSIA_PREFIX`          | The prefix for the workers. The server will prefix every route with this prefix.                                                                                            | `/api/worker` | `/`                     |
| `ELYSIA_LOGGER_LEVEL`    | The log levels to use for the workers. See the [pino documentation](https://getpino.io/#/docs/api?id=level-string).                                                         | `debug`       | `info`                  |

### Stripping or rewriting the prefix

It's possible to tell your proxy to strip or rewrite the prefix before sending the request to the workers.
In this case, you should set the `ELYSIA_PREFIX` to whatever the prefix will be after the rewrite. Example with Caddy and a full strip:

```caddy
https://my-website.com {
  # handle_path will strip the prefix (in this case /api/worker) before sending the request to the workers
  handle_path /api/worker/* {
    reverse_proxy workers:3000
  }

  reverse_proxy * affine:3010
}
```

In this case, the `ELYSIA_PREFIX` should be set empty.

## Development

- (Optional) Change the `.env` values if needed with a `.env.local` and `compose.override.yml` file
- Run `docker compose up -d` (or `make up`) to start the AFFiNE app and the workers
- Go to [http://localhost](http://localhost) to access the AFFiNE app
- Create a new dummy account, create a new doc and try pasting a link or an image to see results
