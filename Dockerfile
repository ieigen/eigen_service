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

# compile circuits

ENV OLD_CIRCUIT_DIR /app/node_modules/@ieigen/zkzru/circuits
ENV OLD_SCRIPTS_DIR /app/node_modules/@ieigen/zkzru/scripts
ENV CIRCUIT_DIR /app/circuits
ENV TEST_PATH /var/run/zkzru

RUN cp -r $OLD_CIRCUIT_DIR $CIRCUIT_DIR && cp -r $OLD_SCRIPTS_DIR /app/scripts && cd $CIRCUIT_DIR && mkdir -p $TEST_PATH

RUN zkit compile -i $CIRCUIT_DIR/update_state_verifier.circom --O2=full -o $TEST_PATH && \
    node ${CIRCUIT_DIR}/../scripts/generate_update_state_verifier.js  && \
    mv input.json ${TEST_PATH}/update_state_verifier_js/

RUN zkit compile -i $CIRCUIT_DIR/withdraw_signature_verifier.circom --O2=full -o $TEST_PATH && \
    node ${CIRCUIT_DIR}/../scripts/generate_withdraw_signature_verifier.js  && \
    mv input.json ${TEST_PATH}/withdraw_signature_verifier_js/

CMD ["forever", "build/src/app.js"]
