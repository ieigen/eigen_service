#FROM node:12.22.5-alpine3.14
FROM ubuntu:20.04
RUN apt-get update \
  && apt-get install -y curl gnupg build-essential wget \
  && curl --silent --location https://deb.nodesource.com/setup_12.x | bash - \
  && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get remove -y --purge cmdtest \
  && apt-get update \
  && apt-get install -y nodejs yarn \
  # remove useless files from the current layer
  && rm -rf /var/lib/apt/lists/* \
  && rm -rf /var/lib/apt/lists.d/* \
  && apt-get autoremove \
  && apt-get clean \
  && apt-get autoclean

MAINTAINER Eigen

EXPOSE 3000

WORKDIR /app
COPY . /app
RUN yarn build

RUN npm install forever -g && npm install

# install zkit
RUN wget https://github.com/ieigen/EigenZKit/releases/download/v0.0.1/zkit-x86_64-unknown-linux-gnu.tar.gz && \
    tar -zxvf zkit-x86_64-unknown-linux-gnu.tar.gz -C /usr/local/bin && \
    rm -f zkit-x86_64-unknown-linux-gnu.tar.gz

CMD ["forever", "build/src/app.js"]
