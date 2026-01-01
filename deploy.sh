#!/bin/sh
export ARCH_DB="arm64v8/postgres:18"
export ARCH_NGINX="arm64v8/nginx:1.29-alpine"
export ARCH_NODE="arm64v8/node:20-alpine"
export ARCH_PGADMIN="benuhx/pgadmin4-pi"
export BUILD_TARGET="production"

docker compose -f docker-compose.yml up -d --build