# Verse Voice frontend — Next.js 14 (standalone output)
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# .npmrc must land before npm ci: it sets legacy-peer-deps=true, and the
# committed lockfile was generated under that flag. Without it npm ci demands
# peer dependencies the lock does not contain and fails.
COPY package*.json .npmrc ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* is inlined into the client bundle at build time, so the API URL
# has to be known here rather than at runtime. It defaults to the relative
# path, which is what the nginx single-origin setup wants.
ARG NEXT_PUBLIC_API_URL=/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------------------------------------------------------------------------

FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ=UTC
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

# Run as a non-root user.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# `output: standalone` splits the build three ways: the server bundle, the
# static assets, and public/ — all three have to be copied or the app 404s its
# own CSS and images.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
