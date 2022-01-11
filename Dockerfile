FROM node:12.22.5-alpine3.14

MAINTAINER Eigen

EXPOSE 3000

RUN apk add --no-cache bash

WORKDIR /app
COPY . /app
RUN yarn build

RUN npm install forever -g && npm install

CMD ["forever", "build/src/app.js"]
