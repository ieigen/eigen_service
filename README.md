# Eigen Service

- PKCS
- Transaction History
- Secret recovery by TSS with Share Refresh
- Eigen Dashboard

## Usage

### Compile

```
yarn && yarn build
yarn test
```

### Launch Server

```
forever start ./build/src/app.js  # or `yarn start` for dev
```


### Login by Oauth

#### Google OAuth

1. Get google oauth url

```

curl http://localhost:3000/auth/google/url

```

2. Submit login request by copying the above url responsed to browser

3. Choose an account and authenticate the login request

4. Redirect the UI root url with jwt token

5. Access other backend API which need authorization with addtional header like:

```

-H "Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNDU1MDE2Njg5ODA0MTc1MTU3OSIsImVtYWlsIjoiaGliZHVhbkBnbWFpbC5jb20iLCJ2ZXJpZmllZF9lbWFpbCI6dHJ1ZSwibmFtZSI6IlN0ZXBoZW4iLCJnaXZlbl9uYW1lIjoiU3RlcGhlbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHajJxZ2poczV6Qk15VzJ6Y0dUeEpyMG9FSmhiTkVaRmdnWm1xUXhEUT1zOTYtYyIsImxvY2FsZSI6InpoLUNOIiwiaWF0IjoxNjM0NDg3MjQyfQ.dkuRxjKyQNtUb2sZFvJ4RXW59p0D-0dhhYzkOjY4pYE"

```



## Deployment in production

### Build

```
docker build -t ieigen/service:v1 .

```

### Run

```
docker run --name=eigen-service -p 3000:3000 -d ieigen/service:v1

```

## Local full cluster

To run the whole cluster, edit `script/deploy.py` and update the `replace_me`, then run

```
python script/deploy.py --PORT_OFFSET=0 --NODE_ENV=preview
yarn deploy_prod
```
