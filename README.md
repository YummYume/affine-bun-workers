# AFFiNE Bun Workers

[![Linting](https://github.com/YummYume/affine-bun-workers/actions/workflows/linting.yml/badge.svg)](https://github.com/YummYume/affine-bun-workers/actions/workflows/linting.yml)
[![Testing](https://github.com/YummYume/affine-bun-workers/actions/workflows/testing.yml/badge.svg)](https://github.com/YummYume/affine-bun-workers/actions/workflows/testing.yml)

[AFFiNE](https://affine.pro) workers but for self-hosted instances, using [Bun](https://bun.sh) and [Elysia](https://elysiajs.com).

## Content

- [AFFiNE Bun Workers](#affine-bun-workers)
  - [Content](#content)
  - [Why ?](#why-)
  - [Currently supported workers](#currently-supported-workers)
  - [Thanks](#thanks)
  - [Usage](#usage)
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

TODO

## Development

- (Optional) Change the .env values if needed
- Run `docker compose up -d` (or `make up`) to start the AFFiNE app and the workers
- Go to [http://localhost](http://localhost) to access the AFFiNE app
- Create a new dummy account, create a new doc and try pasting a link or an image to see results
