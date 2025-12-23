# Target platform (amd64 / arm32v7)
ARG ARCH_NODE

FROM ${ARCH_NODE} AS base

# Install APT dependencies
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    wget \
    python3 \
    python3-pip \
    python3-pil \
    python3-numpy \
 && rm -rf /var/lib/apt/lists/*
 
# App setup
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install

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

EXPOSE 3333
CMD ["npm", "run", "start"]

FROM base AS dev

EXPOSE 3333
CMD ["npm", "run", "dev"]