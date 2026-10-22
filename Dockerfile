FROM node:24.22.1-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM node:24.22.1-alpine AS builder
WORKDIR /app
# Build metadata shown in the page footer, and the bridge version stamped into the content (see source.config.ts).
ARG GIT_SHA
ARG BUILD_DATE
ARG COMFICONF_BRIDGE_VERSION
ENV GIT_SHA=$GIT_SHA \
    BUILD_DATE=$BUILD_DATE \
    COMFICONF_BRIDGE_VERSION=$COMFICONF_BRIDGE_VERSION \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run postinstall
RUN npm run build

FROM node:24.22.1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
