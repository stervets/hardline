# ---------- base ----------
FROM node:24.12.0-bookworm-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN corepack enable && yarn install

COPY . .

# ---------- dev ----------
FROM base AS dev
ENV NODE_ENV=development
CMD ["yarn", "dev"]

# ---------- build ----------
FROM base AS build
RUN yarn build

# ---------- prod ----------
FROM node:24.12.0-bookworm-slim AS prod
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
