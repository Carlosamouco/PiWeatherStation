#!/bin/sh

# Set the variables for this session
export ARCH_DB="arm64v8/postgres:18"
export ARCH_NGINX="arm64v8/nginx:1.29-alpine"
export ARCH_NODE="arm64v8/node:20-alpine"
export ARCH_PGADMIN="benuhx/pgadmin4-pi"
export BUILD_TARGET="prod"

# Run compose
docker compose -f docker-compose.yml up -d --build