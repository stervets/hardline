#!/usr/bin/bash
set -e
BACKEND_TARGET=dev NODE_ENV=development docker compose --profile dev up --build
