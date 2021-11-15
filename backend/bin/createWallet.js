'use strict';

const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// TODO :

async function main() {
    try {
        const wallet = new FileSystemWallet('./wallet');

        const certPath = path.resolve('crypto-config/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/User1@org1.example.com-cert.pem');
        const cert = fs.readFileSync(certPath, 'utf8');
        
        const keyPath = path.resolve('crypto-config/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/encodedstr_sk');
        const key = fs.readFileSync(keyPath, 'utf8');

        const identityLabel = 'USERNAME';
        const identity = X509WalletMixin.createIdentity('MSPNAME', cert, key);

        await wallet.import(identityLabel, identity);
    } catch (error) {
        console.error(`Failed to enroll : ${error}`);
        process.exit(1);
    }
}

main();
