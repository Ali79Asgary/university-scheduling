FROM node:12

WORKDIR /application

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_APP_PORT=8080

EXPOSE 8080

CMD [ "npm", "start" ]