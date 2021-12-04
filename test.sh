# token=$(curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user" -d '{"action": "new", "kind": 0, "unique_id": 2, "email": "2@a.com", "name": "eig", "given_name": "1", "family_name": "2", "locale": "en-US", "verified_email": "0", "picture": "1", "secret": "1"}' | jq -r .data.token)
# echo

# curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user" -d '{"action": "new", "kind": 0, "unique_id": 3, "email": "3@a.com", "name": "eig", "given_name": "1", "family_name": "2", "locale": "en-US", "verified_email": "0", "picture": "1", "secret": "1"}'
# echo

# curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user" -d '{"action": "new", "kind": 0, "unique_id": 4, "email": "4@a.com", "name": "eig", "given_name": "1", "family_name": "2", "locale": "en-US", "verified_email": "0", "picture": "1", "secret": "1"}'
# echo

# curl -XPUT -H "Content-Type:application/json"  --url "localhost:3000/user/2/otpauth" -d '{"secret": "GAXGGYT2OU2DEOJR"}' -H "Authorization:Bearer ${token}"
# echo

# curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/otpauth" -d '{"user_id": 2, "code": "123456"}'
# echo
###########
# curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user/2/guardian" -d '{"guardian_id": 3}'
# echo

# curl -XPUT -H "Content-Type:application/json"  --url "localhost:3000/user/3/guardian" -d '{"action": "confirm", "guardian_id": 2}'
# echo

# curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user/2/guardian" -d '{"guardian_id": 4}'
# echo

# curl -XPUT -H "Content-Type:application/json"  --url "localhost:3000/user/4/guardian" -d '{"action": "confirm", "guardian_id": 2}'
# echo

# curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/2" -d '{"action": "guardians", "status": 1}'
# echo

# curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/2" -d '{"action": "strangers"}'
# echo

# curl -XPUT -H "Content-Type:application/json"  --url "localhost:3000/user/2/otpauth" -d '{"secret": "GAXGGYT2OU2DEOJR"}'
# echo

# curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/2/otpauth" -d '{"code": "123456"}'
# echo

curl -XPOST -H "Content-Type:application/json"  --url "localhost:3000/user/2/allowance" -d '{ "network": "mainnet", "token_address": "0x1", "user_address": "0x2", "swap_address": "0x3", "allowance": 4 }'

curl -XGET -H "Content-Type:application/json"  --url "localhost:3000/user/2/allowance" -d '{ "network": "mainnet", "token_address": "0x1", "user_address": "0x2", "swap_address": "0x3" }'