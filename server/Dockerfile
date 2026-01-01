# Target platform (amd64 / arm32v7)
ARG ARCH_NODE=node:24-alpine

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
 
FROM base AS prod

# Add Raspbian key and source
# RUN wget -qO - http://archive.raspbian.org/raspbian.public.key | apt-key add - \
#  && echo "deb http://mirrordirector.raspbian.org/raspbian/ jessie main contrib non-free rpi" >> /etc/apt/sources.list \
#  && apt-get update

# Download and install RTIMULib packages
# RUN wget -P /tmp https://archive.raspberrypi.org/debian/pool/main/p/python-sense-hat/python-sense-hat_2.1.0-1_armhf.deb \
#  && wget -P /tmp https://archive.raspberrypi.org/debian/pool/main/r/rtimulib/python3-rtimulib_7.2.1-3_armhf.deb \
#  && wget -P /tmp https://archive.raspberrypi.org/debian/pool/main/r/rtimulib/python-rtimulib_7.2.1-3_armhf.deb \
#  && wget -P /tmp https://archive.raspberrypi.org/debian/pool/main/r/rtimulib/librtimulib7_7.2.1-3_armhf.deb \
#  && dpkg -i /tmp/*.deb || apt-get install -f -y \
#  && rm -rf /tmp/*.deb

# App setup
COPY package*.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/output /app/src
RUN chmod +x /app/src/python/scripts/bme280
WORKDIR /app

EXPOSE 3333
CMD ["npm", "run", "start"]

FROM base AS dev

# Install APT dependencies
RUN apk add --no-cache \
    wget \
    python3 \
    py3-pip \
    py3-numpy \
    py3-pillow

# App setup
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

EXPOSE 3333
CMD ["npm", "run", "dev"]