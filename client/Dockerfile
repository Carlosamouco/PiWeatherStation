FROM arm32v7/node

RUN npm install -g --unsafe-perm @angular/cli

RUN mkdir -p /usr/src/app

COPY package.json /usr/src/app/

WORKDIR /usr/src/app

RUN npm install

EXPOSE 4200

CMD ["ng", "serve", "--disable-host-check", "--host", "0.0.0.0"]

