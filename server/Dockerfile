FROM gcc AS bme280-driver-build
WORKDIR /app/
RUN git clone --branch bme280_v3.5.1 --depth 1 https://github.com/boschsensortec/BME280_SensorAPI.git bme280_api
COPY ./src/sensor/driver/bme280.c /app/
RUN gcc -O3 \
  ./bme280.c \
  ./bme280_api/bme280.c \
  -I ./bme280_api \
  -o ./bme280

FROM node:24-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:24-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:24-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build
RUN mkdir -p /app/output && \
    cd /app/src && \
    find . -type f ! -name "*.ts" ! -name "*.d.ts" -exec cp --parents {} /app/output \;
 
FROM node:24-alpine AS production

# App setup
COPY package*.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/output /app/src
COPY --from=bme280-driver-build /app/bme280 /app/src/sensor/driver/
RUN apk add --no-cache gcompat
RUN chmod +x /app/src/sensor/driver/bme280
WORKDIR /app
ENV NODE_ENV=production

EXPOSE 3333
CMD ["npm", "run", "start"]

FROM node:24-alpine AS development

# App setup
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

EXPOSE 3333
CMD ["npm", "run", "dev"]