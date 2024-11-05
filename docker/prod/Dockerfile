FROM oven/bun:debian AS builder

WORKDIR /home/bun/affine-workers

COPY ./src ./src
COPY ./tsconfig.json ./package.json ./bun.lockb ./

RUN bun install --production && bun run build

FROM debian

RUN useradd -ms /bin/bash bun

WORKDIR /home/bun/affine-workers

COPY --from=builder --chown=bun:bun /home/bun/affine-workers/build ./build
# We need to copy the node_modules because of sharp
# TODO: Copy only the necessary modules for sharp
COPY --from=builder --chown=bun:bun /home/bun/affine-workers/node_modules ./node_modules

ENV NODE_ENV=production
ENV ELYSIA_PORT=3000
ENV ELYSIA_ALLOWED_ORIGINS=localhost
ENV ELYSIA_PREFIX=/api/workers
ENV ELYSIA_LOGGER_LEVEL=debug

USER bun

CMD ["./build/server"]
