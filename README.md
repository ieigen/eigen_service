# Eigen Service

- PKCS
- Transaction History
- Secret recovery by TSS with Share Refresh

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

### PKCS

Simple local public key cache service on sqlite, with ecies inside.

```

#query
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/store?digest=1"

#query all
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/stores"

# add
curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/store" -d '{"digest":"1", "public_key":"pk"}' -H "Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJlbWFpbCI6IkVpZ2VuTmV0d29ya0BnbWFpbC5jb20iLCJuYW1lIjoiRWlnZW4gTmV0V29yayIsImdpdmVuX25hbWUiOiJFaWdlbiBOZXRXb3JrIiwiZmFtaWx5X25hbWUiOiJFaWdlbiBOZXRXb3JrIiwicGljdHVyZSI6IiIsImxvY2FsZSI6IlNHIiwidmVyaWZpZWRfZW1haWwiOiJFaWdlbk5ldHdvcmtAZ21haWwuY29tIiwiaWF0IjoxNjM1NTgyMzI4fQ.F6zDTYVWm0I40hjchvPf4nZn56wIazunTXtUd-oFDaI"
```

### Transaction History

#### Data type

- status： status of the transaction, 0: new, 1: confirmed, 2. only for withdraw, confirmed in Layer 1
- type: transaction type

```
const TX_TYPE_L1ToL1 = 0x0
const TX_TYPE_L1ToL2 = 0x1
const TX_TYPE_L2ToL1 = 0x2
const TX_TYPE_L2ToL2 = 0x3
```

#### API

```
# query
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/txh?txid=1"

# search all (with/without filters)
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/txhs?action=search&from=0x1"

# search all (with network_id filtered)
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/txhs?action=search&from=0x1&network_id=1"

# search from or to address  (with/without filters, also provide order, page, page_size)
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/txhs?action=search_both_sides&address=0x1"

# query all transactions with the reverse time order (also support page)
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/txhs?action=search&order=1"

# query all transactions by page number
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/txhs?action=search&page=1&page_size=10"

# query the count of all transactions on L2 (L2 -> L1, L2 -> L2)
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/txh?action=transaction_count_l2"

# query the count of all accounts on L2 ('from' on L2 -> L1, 'from' and 'to' on L2 -> L2)
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/txh?action=account_count_l2"

# add
curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/txh" -d '{"txid": "2", "network_id": "1", "from": "0x2", "to_network_id": "1", "to": "0x2", "type":0, "value": 1, "block_num": 1027, "name": "ERC20", "operation": "send"}'

# update
curl -XPUT -H "Content-Type:application/json"  --url "localhost:3000/txh/{txid}" -d '{"status": 1, "sub_txid": "2121"}'

# query all transactions on L2 (L1 -> L2 and L2 -> L1, with/witout filters, also support page and reverse order)
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/txhs?action=search_l2&from=0x1&page=1&page_size=10&order=1"
```

### User Management

#### API

```
# Send a guardian request
curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/guardian" -d '{"guardian_id": 3}'

# Send a guardian request (or user email instead)
curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/guardian" -d '{"guardian_email": "a@b.com"}'

# Confirm a guardian request
curl -XPUT -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/guardian" -d '{"action": "confirm", "guardian_id": 3}'

# Confirm a guardian request (or user email instead)
curl -XPUT -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/guardian" -d '{"action": "confirm", "guardian_email": "a@b.com"}'

# Reject a guardian request
curl -XPUT -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/guardian" -d '{"action": "reject", "guardian_id": 3}'

# Reject a guardian request (or user email instead)
curl -XPUT -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/guardian" -d '{"action": "reject", "guardian_email": "a@b.com"}'

# Remove a guardian
curl -XDELETE -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/guardian" -d '{"guardian_id": 3}'

# Remove a guardian
curl -XDELETE -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/guardian" -d '{"guardian_email": "a@b.com"}'

# Get guardians list
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}?action=guardians"
# Status:
#         1 mutual
#         2 waiting
#         3 confirming

# Get guardians list (We can filter the status, e.g., get only mutual status guardians)
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}?action=guardians&status=1"

# Get strangers list
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}" -d '{"action": "strangers"}'

# Save recovery data
curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/recovery" -d '{"user_id": 2, "name": "recover_1", "desc": "NFT", "total_shared_num": 1, "threshold": 1, "friends": [{"user_id": 2, "email": "a@b.com"}, {"user_id": 3, "email": "c@d.com"}]}'

# Get recovery data
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/recovery?user_id=2"

# Detele recovery
curl -XDELETE -H "Content-Type:application/json"  --url "localhost:3000/recovery"  -d '{"id": 6}'

# Statistics
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/statistics" -d '{"kind": "sendemail"}'

# Save user's allowance for a token in a network for a swap contract
curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/allowance" -d '{ "network_id": "1", "token_address": "0x1", "user_address": "0x2", "swap_address": "0x3", "allowance": 4 }'

# Get user's allowance for a token in a network for a swap contract
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/allowance?network_id=1&token_address=0x1&user_address=0x2&swap_address=0x3'

# Get user's allowances for display
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/allowances?network_id=1&user_address=0x2'

# Save user's address
curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/address" -d '{ "network_id": "1", "user_address": "0x2" , "cipher_key": "0x"}'

# Get user's addresses on all networks
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/addresses'

# Get user's addresses on all networks (We can filter the network_id)
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/addresses?network_id=1'

# Add a wallet (returns the corresponding wallet id)
curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/wallet" -d '{"name": "test", "address": "0x123", "ens": "test.ens"}'

# Get all wallets
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/wallets"

# Add a signer for a wallet
curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/wallet/{wallet_id}/signer" -d '{"name": "name1", "ens": "example.ens", "address": "0x123"}'

# Get all signers for a wallet (including states)
# Status:
#         1 to be confirmed
#         2 rejected
#         3 active
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/wallet/{wallet_id}/signers"

# Update status for a signer
curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/wallet/{wallet_id}/signer" -d '{"signer_id": 1, "status": 2}'

# Detele a signer
curl -XDELETE -H "Content-Type:application/json"  --url "localhost:3000/user/{user_id}/wallet/{wallet_id}/signer"  -d '{"signer_id": 1}'

# Search User
curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/users/statistics" -d '{"kind": "sendemail"}'
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

#### Google Authenticator TOTP

```

# Save or update otpauth secret

curl -XPUT -H "Content-Type:application/json" --url "localhost:3000/user/{user_id}/otpauth" -d '{"secret": "GAXGGYT2OU2DEOJR"}'

# Verify code

curl -XPOST -H "Content-Type:application/json" --url "localhost:3000/user/{user_id}/otpauth" -d '{"code": "123456"}'

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

```

```
