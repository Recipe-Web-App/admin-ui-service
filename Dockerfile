# syntax=docker/dockerfile:1.7-labs
# ==============================================================================
# Multi-stage Dockerfile for Angular 20 Admin UI Service with SSR
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base Image with Security Updates
# ------------------------------------------------------------------------------
FROM node:20.18.1-alpine3.20 AS base

# Security updates and essential packages
RUN apk update && apk upgrade && \
    apk add --no-cache \
    dumb-init=1.2.5-r3 \
    tini=0.19.0-r3 \
    curl=8.9.1-r2 \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S angular -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production
ENV CI=true

# ------------------------------------------------------------------------------
# Stage 2: Dependencies Installation
# ------------------------------------------------------------------------------
FROM base AS deps

# Copy package files for better caching
COPY package*.json ./

# Install dependencies with npm ci for reproducible builds
RUN npm ci --only=production --frozen-lockfile && \
    npm cache clean --force

# Install dev dependencies in separate layer for build stage
FROM base AS deps-build
COPY package*.json ./
RUN npm ci --frozen-lockfile && \
    npm cache clean --force

# ------------------------------------------------------------------------------
# Stage 3: Build Application
# ------------------------------------------------------------------------------
FROM deps-build AS build

# Copy source code
COPY . .

# Set build-time environment variables
ARG API_URL=http://localhost:8080/api
ARG AUTH_ISSUER=http://localhost:8080/auth
ARG AUTH_CLIENT_ID=admin-ui-client
ARG NODE_ENV=production

ENV API_URL=$API_URL
ENV AUTH_ISSUER=$AUTH_ISSUER
ENV AUTH_CLIENT_ID=$AUTH_CLIENT_ID

# Build the application with SSR
RUN npm run build:ssr

# ------------------------------------------------------------------------------
# Stage 4: Production Runtime
# ------------------------------------------------------------------------------
FROM base AS runtime

# Add metadata labels following OCI spec
LABEL org.opencontainers.image.title="Recipe Web App - Admin UI Service" \
      org.opencontainers.image.description="Angular 20 admin dashboard with SSR support" \
      org.opencontainers.image.version="0.1.0" \
      org.opencontainers.image.vendor="Recipe Web App Team" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/Recipe-Web-App/admin-ui-service" \
      org.opencontainers.image.documentation="https://github.com/Recipe-Web-App/admin-ui-service" \
      maintainer="Recipe Web App Team"

# Copy production dependencies
COPY --from=deps --chown=angular:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=angular:nodejs /app/dist ./dist

# Switch to non-root user
USER angular

# Expose port
EXPOSE 4000

# Use tini as PID 1 for proper signal handling
ENTRYPOINT ["tini", "--"]

# Start the application
CMD ["node", "dist/admin-ui-service/server/server.mjs"]

# ------------------------------------------------------------------------------
# Development Stage (Optional - for debugging)
# ------------------------------------------------------------------------------
FROM deps-build AS development

# Install additional dev tools
RUN npm install -g @angular/cli@20.3.1

# Copy source code
COPY --chown=angular:nodejs . .

# Switch to non-root user
USER angular

# Expose development ports
EXPOSE 4200 49153

# Start development server
CMD ["npm", "run", "dev"]
