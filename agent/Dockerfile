# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# ─── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Only install production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist

# Bundle curriculum JSON so ContentFetcher can read local files
COPY ../docs/curriculum/ ./docs/curriculum/

# Cloud Run default port
ENV PORT=8080
EXPOSE 8080

# Run as non-root for security
RUN addgroup -S agent && adduser -S agent -G agent
USER agent

CMD ["node", "dist/server.js"]
