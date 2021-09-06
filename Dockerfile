FROM node:16-slim

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]