ARG ARCH_NODE=node:24-alpine

FROM --platform=linux/arm64 gcc:latest AS bme280-build
COPY ./bme280 /app/
RUN gcc -O3 \
  ./main.c \
  ./bme280_api/bme280.c \
  -I ./bme280_api \
  -o ./bme280

FROM ${ARCH_NODE} AS base

FROM ${ARCH_NODE} AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM ${ARCH_NODE} AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM ${ARCH_NODE} AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build
RUN mkdir -p /app/output && \
    cd /app/src && \
    find . -type f ! -name "*.ts" ! -name "*.d.ts" -exec cp --parents {} /app/output \;
 
FROM base AS production

# App setup
COPY package*.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/output /app/src
COPY --from=bme280-build /app/bme280 /app/src/sensor/driver/
RUN chmod +x /app/src/sensor/driver/bme280
WORKDIR /app
ENV NODE_ENV=production

EXPOSE 3333
CMD ["npm", "run", "start"]

FROM base AS development

# App setup
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

EXPOSE 3333
CMD ["npm", "run", "dev"]