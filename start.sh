#!/usr/bin/env bash

# Exit gracefully
trap "exit" SIGINT
trap "exit" SIGTERM

echo "Installing dependencies"

bun install

echo "Starting dev server"

bun run dev
