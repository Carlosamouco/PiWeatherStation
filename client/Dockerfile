ARG ARCH_NODE=node:24-alpine

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

FROM ${ARCH_NODE} AS production
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app

ENV PORT=4200
EXPOSE 4200

CMD ["npm", "run", "start"]

FROM ${ARCH_NODE} AS development
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app

ENV PORT=4200
EXPOSE 4200

CMD ["npm", "run", "dev"]
