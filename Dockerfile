# syntax=docker/dockerfile:1.21-labs
# ==============================================================================
# Multi-stage Dockerfile for Angular 20 Admin UI Service with SSR
# ==============================================================================

# Global build arguments
ARG APP_VERSION
ARG BUILD_DATE
ARG VCS_REF

# Stage 1: Dependencies
FROM oven/bun:1-alpine AS deps
LABEL stage=deps \
      org.opencontainers.image.title="Admin UI Service - Dependencies" \
      org.opencontainers.image.description="Dependencies stage for Admin UI Service" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="Recipe App Team" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/Recipe-Web-App/admin-ui-service"

WORKDIR /app

# Install security updates and required packages
# Using latest versions from Alpine repository
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        libc6-compat \
        ca-certificates \
        tzdata && \
    rm -rf /var/cache/apk/*

# Set timezone
ENV TZ=UTC

# Copy package files with specific ownership
COPY --chown=bun:bun package.json bun.lock ./

# Verify package integrity and install dependencies
RUN bun install --production --frozen-lockfile && \
# Remove package files to reduce attack surface
    rm -f package.json bun.lock

# Stage 2: Builder
FROM oven/bun:1-alpine AS builder
LABEL stage=builder \
      org.opencontainers.image.title="Admin UI Service - Builder" \
      org.opencontainers.image.description="Build stage for Admin UI Service" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}"

WORKDIR /app

# Install build dependencies
# Using latest versions from Alpine repository
RUN apk add --no-cache \
        nodejs \
        python3 \
        make \
        g++ \
        git && \
    rm -rf /var/cache/apk/*

# Copy production node_modules from deps stage
COPY --from=deps --chown=bun:bun /app/node_modules ./node_modules

# Copy package files
COPY --chown=bun:bun package.json bun.lock ./

# Install all dependencies (including devDependencies) with mount cache
RUN --mount=type=cache,target=/root/.bun/install/cache \
    --mount=type=cache,target=/app/.angular/cache \
    bun install --frozen-lockfile

# Copy source code with proper ownership and .dockerignore respect
COPY --chown=bun:bun . .

# Set build environment variables
ENV NG_CLI_ANALYTICS=false \
    NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=2048"

# Build the application with optimizations
RUN --mount=type=cache,target=/app/.angular/cache bun run build && \
    # Verify build artifacts
    test -d dist || (echo "Build failed: dist not found" && exit 1)

# Stage 3: Runtime Security Scanner (Optional)
FROM builder AS security-scanner
LABEL stage=security-scanner

# Install security scanning tools
# Using latest versions from Alpine repository
RUN apk add --no-cache curl jq && \
    rm -rf /var/cache/apk/* && \
    # Run security scans (optional, can be skipped in CI)
    # Note: bun audit is experimental, using || true to avoid build failures
    RUN bun pm audit || true

# Stage 4: Final Runtime
FROM oven/bun:1-alpine AS runner
LABEL stage=runner \
      org.opencontainers.image.title="Admin UI Service" \
      org.opencontainers.image.description="Production-ready Admin UI Service" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="Recipe App Team" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/Recipe-Web-App/admin-ui-service" \
      org.opencontainers.image.documentation="https://github.com/Recipe-Web-App/admin-ui-service" \
      org.opencontainers.image.authors="Recipe Web App Team" \
      maintainer="Recipe Web App Team"

# Install runtime security updates and essential packages
# Using latest versions from Alpine repository
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        dumb-init \
        ca-certificates \
        tzdata \
        tini && \
    rm -rf /var/cache/apk/* && \
    # Create app directory with secure permissions
    mkdir -p /app

# Set secure environment variables
ENV NODE_ENV=production \
    NG_CLI_ANALYTICS=false \
    TZ=UTC \
    PORT=4000 \
    HOSTNAME="0.0.0.0"

WORKDIR /app

# Copy built application with proper ownership and minimal files
COPY --from=builder --chown=bun:bun /app/dist ./dist
COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/package.json ./package.json

# Set final permissions and switch to non-root user
RUN chown -R bun:bun /app && \
    chmod 755 /app
USER bun

# Create non-root owned directories for Angular
RUN mkdir -p dist/cache && \
    chmod 755 dist/cache

# Expose port (non-privileged)
EXPOSE 4000

# Use tini for proper signal handling
ENTRYPOINT ["tini", "--"]

# Run with Bun for faster startup and lower memory usage
CMD ["bun", "run", "dist/admin-ui-service/server/server.mjs"]

# Add build metadata as labels (populated by CI/CD)
LABEL build.number="${BUILD_NUMBER:-unknown}" \
      build.url="${BUILD_URL:-unknown}" \
      git.branch="${GIT_BRANCH:-unknown}" \
      git.commit="${GIT_COMMIT:-unknown}"

# Security: Run as non-root, read-only root filesystem ready
# Note: Use --read-only flag when running the container
# docker run --read-only --tmpfs /tmp --tmpfs /app/dist/cache admin-ui-service
