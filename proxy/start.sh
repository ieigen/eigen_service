docker run -d --rm --name nginx-geth --network host -v $PWD/logs/:/logs  -v $PWD/certs:/certs -v $PWD/etc/nginx.conf:/etc/nginx/nginx.conf nginx

