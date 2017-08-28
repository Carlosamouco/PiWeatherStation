FROM node

RUN mkdir -p /usr/src/app

COPY package.json /usr/src/app/

WORKDIR /usr/src/app

RUN npm install

EXPOSE 3333

CMD ["npm", "run", "dev"]
