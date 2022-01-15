FROM node:12.22.5-alpine3.14

MAINTAINER Eigen

EXPOSE 3000

RUN apk add --no-cache bash

WORKDIR /app
COPY . /app
RUN yarn build

RUN npm install

CMD utils/wait_for_it.sh eigen_service:3000 -- node build/utils/pk_register.js
