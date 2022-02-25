# Fabric-block-explorer
This is block explorer that does not require any database configuration for hyperledger fabric chaincode developers. <br>
You can check block with blocknumber, blocknumber range to GUI. <br>
There is options to presentation block data. (Arguments, Transactions, RWSet, ...)

## Require
```
hyperledger fabric 1.4.x 
nodejs ^10.15.3 
npm ^6.4.1 
```

## Usage

1. install npm package.
```
$ npm install
```
2. move the connection.json file  connection/ <br>
3. modify bin/.env (CERT_PATH, KEY_PATH, MSP_NAME, USER_NAME) <br>
```
Example
CERT_PATH ${YOUR_PATH}/crypto-config/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/User1@org1.example.com-cert.pem
KEY_PATH ${YOUR_PATH}/crypto-config/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/fcd7abe157c9f318b6147a1d0ee3882822f2fe479d76d0a3857e5a987ef1bf81_sk
```
4. run createWallet.js
```
$ cd bin
$ node createWallet
// You can check wallet files in connection/wallet
```

5. modify .env (CONNECTIONFILE, WALLET, FABRIC_CLIENT_ID, MULTIHOST) <br>
6. run server.
```
$ node main
```

## CLI
If you don't need a GUI, see below. <br>

```
Channel name is 'general' in example.

// join channel
curl -XPOST http://IP:5000/pool -H "Content-Type: application/json" -d '{ "channelName": "general" }'

// get channel
curl http://IP:5000/pool/[CHANNELNAME]
curl http://IP:5000/pool/general

// get channel group
curl http://IP:5000/pool


// option in get block, block list
 All : 0,
 Response : 1,
 ChannelName : 2,
 Timestamp : 3,
 TransactionId : 4,
 ChaincodeName : 5,
 ChaincodeAgrs : 6,
 RWset : 7


// get block by block number with option
curl http://IP:5000/block/blockByNumber/[CHANNEL]/[BLOCKNUMBER]?option=[OPTION]
curl http://IP:5000/block/blockByNumber/general/10?option=3
 
 
// get block list by block number with option
curl http://IP:5000/block/blockByRange/[CHANNEL]/[STARTBLOCK]/[ENDBLOCK]?option=[OPTION]
curl http://IP:5000/block/blockByRange/general/5/10?option=3
 
 
// get block by transaction id
curl http://IP:5000/block/blockByTxId/[CHANNEL]/[TXID]
curl http://IP:5000/block/blockByTxId/general/126eddd3fa23bd58655687625b901430c43c78a49c8a709c5d7ecee7def90d93

// etc ( TODO:move /block --> /pool ? )
// get channel's block height 
curl http://IP:5000/block/blockHeight/[CHANNELNAME]

// get channel's organizations
curl http://IP:5000/block/organization/[CHANNELNAME]

```


## Front-end Example
This is a simple implementation front-end application. <br>
You can create front-end application to suit your case.

**#1. home**
![1](https://user-images.githubusercontent.com/72970043/147194964-ac4b2106-db40-4d54-b875-cf924a2711f2.PNG)

**#2. join channel**
![2](https://user-images.githubusercontent.com/72970043/147194972-cafa481f-9e61-45c2-9d0a-e007d221a0a2.PNG)

**#3. click the "move" in #2** 
![3](https://user-images.githubusercontent.com/72970043/147194973-bd84abe9-07f4-4eda-b952-4ddf05559293.PNG)

**#4. get block list by block number**
![4](https://user-images.githubusercontent.com/72970043/147194992-524fc3e4-179d-46c8-a890-f89e18a0f7b7.PNG)

**#5. get block with option**
![5](https://user-images.githubusercontent.com/72970043/147194997-fa124c7b-c6d8-4ea2-a20e-02f89e2896cd.PNG)

![6](https://user-images.githubusercontent.com/72970043/147195003-c37a28c7-35ad-4744-81ff-8e8b42889236.PNG)

![7](https://user-images.githubusercontent.com/72970043/147195008-09c183cf-2e82-421a-8ea7-6d67aa5e28b4.PNG)

