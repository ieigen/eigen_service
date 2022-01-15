version: "3"

services:
  secret:
    build: ../secret
    environment:
      - NODE_ENV={{NODE_ENV}}
    ports:
      - "{{EIGEN_SECRET_PORT}}:80"
    networks:
      - default
  proxy:
    build: ./proxy/
    ports:
      - "{{EIGEN_PROXY_PORT}}:8443"
    networks:
      - default
    external_links:
      - {{EIGEN_SERVICE_ADDR}}_1:eigen_service
  eigen_service:
    build: .
    ports:
      - "{{EIGEN_SERVICE_PORT}}:3000"
    networks:
      - default
    volumes:
      - "./data:/app/data"
  pkcs:
    build:
      context: .
      dockerfile: ./utils/Dockerfile
    external_links:
      - {{EIGEN_SERVICE_ADDR}}_1:eigen_service
    networks:
      - default
    depends_on:
      - fns
      - eigen_service
      - proxy
  fns:
    image: ieigen/fns:v4
    working_dir: "/app/release/services"
    command:
      - bash
      - -c
      - |
        source /opt/sgxsdk/environment
        ./fns
    ports:
      - "{{EIGEN_FNS_PORT}}:8082"
    environment:
      - IAS_SPID={{IAS_SPID}}
      - IAS_KEY={{IAS_KEY}}
      - RUST_LOG=debug
      - KMS_KEY_ID={{KMS_KEY_ID}}
      - KMS_CLIENT_ID={{KMS_CLIENT_ID}}
      - KMS_CLIENT_SK={{KMS_CLIENT_SK}}
      - KMS_CLIENT_REGION={{KMS_CLIENT_REGION}}
    networks:
      - default

networks:
  default:
    driver: bridge
