FROM node:latest

RUN npm install -g http-server

WORKDIR /client-app

COPY package*.json /client-app/

RUN npm install

COPY . /client-app/

RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]