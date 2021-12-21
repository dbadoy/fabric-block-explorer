# Fabric-block-explorer
This is block explorer for hyperledger fabric chaincode developer. <br>
you can check block with blocknumber, blocknumber range to GUI. <br>
There is options to presentation block data. (Arguments, Transactions, RWSet, ...)

## Require
```
Hyperledger fabric 1.4.x 
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
![1](https://user-images.githubusercontent.com/72970043/146882850-0b6c95cf-81dd-4b2c-88bd-52bf10a131f4.PNG)

**#2. join channel**
![2](https://user-images.githubusercontent.com/72970043/146882983-b14f6829-0fdb-456a-97e0-ba0653128c97.PNG)

**#3. click the "move" in #2** 
![3](https://user-images.githubusercontent.com/72970043/146882990-e0b71b49-aa1d-4173-b8d2-ba1829d82a29.PNG)

**#4. get block list by block number**
![4](https://user-images.githubusercontent.com/72970043/146882996-428f17ce-6906-4cd4-83ee-72df56b77f47.PNG)

**#5. get block with option**
![5](https://user-images.githubusercontent.com/72970043/146882998-8661cc75-fede-43f3-b207-232b6b4df379.PNG)

![6](https://user-images.githubusercontent.com/72970043/146883006-a6766ffb-e102-4154-84b8-fcfd2537a565.PNG)

![7](https://user-images.githubusercontent.com/72970043/146883019-916a280b-16aa-4547-844b-7df9176aeefa.PNG)

