'use strict';

const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

require("dotenv").config();

async function main() {
    try {
        const wallet = new FileSystemWallet('../connection/wallet');

        const certPath = path.resolve(process.env.CERT_PATH);
        const cert = fs.readFileSync(certPath, 'utf8');
        
        const keyPath = path.resolve(process.env.KEY_PATH);
        const key = fs.readFileSync(keyPath, 'utf8');

        const identityLabel = process.env.USER_NAME;
        const identity = X509WalletMixin.createIdentity(process.env.MSP_NAME, cert, key);

        await wallet.import(identityLabel, identity);
    } catch (error) {
        console.error(`Failed to enroll : ${error}`);
        process.exit(1);
    }
}

main();
