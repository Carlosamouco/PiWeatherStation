# Target platform (amd64 / arm32v7)
ARG ARCH_DB=postgres:18-alpine

FROM ${ARCH_DB}

ADD weather_db.sql /docker-entrypoint-initdb.d
