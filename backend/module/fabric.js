const path = require('path'); 
const { newError, errType } = require("./errhandler");

const { FileSystemWallet ,Gateway } = require('fabric-network');
const ccpPath = path.resolve(String(process.env.CONNECTIONORG1));

const walletPath = path.join(process.env.WALLET);
const wallet = new FileSystemWallet(walletPath);

module.exports.genFabricGateway = async function() {
    if(!walletChecker(process.env.FABRIC_CLIENT_ID)) {
        throw newError(errType.FABRIC, "not exist user in wallet.");
    };

    var connectionOptions = {
        identity: process.env.FABRIC_CLIENT_ID,
        wallet: wallet,
        discovery: { enabled: true, asLocalhost: false}, 
    } 

    if(process.env.MULTIHOST == "true") {
        connectionOptions.discovery.asLocalhost = true;
    }

    const gateway = new Gateway();
    try {
        await gateway.connect(ccpPath, connectionOptions);    
        console.log("success to create gateway.");
        return gateway;
    } catch (error) {
        console.log("error in gateway connect! :", error);
        throw newError(errType.FABRIC, error)
    }
}

module.exports.FabricDisconnection = async function(gateway, channel) { 
    try {
        gateway.disconnect();
        channel.close();
    } catch(error) {
        console.log("error in fabric disconnect! : ", error);
        throw newError(errType.FABRIC, error);
    }
}

module.exports.getFabNetwork = async function(gateway, channelName) {
    try {
        const network = await gateway.getNetwork(channelName);
        return network;
    } catch (error) {
        console.log("error in create network! : ", error);
        throw newError(errType.FABRIC, error);
    }
}

module.exports.getFabChannel = async function(network, channelName) {
    try {
        const channel = await network.getChannel(channelName);
        return channel   
    } catch (error) {
        console.log("error in create channel! : ", error);
        throw newError(errType.FABRIC, error);
    }
}

module.exports.getFabContract = async function(network, contractName) {
    try {
        const contract = await network.getContract(contractName);
        return contract;
    } catch (error) {
        console.log("error in cretae contract! : ", error);
        throw newError(errType.FABRIC, error);
    }
}

module.exports.getBlockByNumber = async function(channel, blockNumber) {
    try {
        const res = await channel.queryBlock(blockNumber, '', false, false);
        return res;
    } catch (error) {
        console.log("error in query block by block number.");
        throw newError(errType.FABRIC, error);
    }
}

module.exports.getBlockByTxId = async function(channel, transactionId) {
    try {
        const res = await channel.queryBlockByTxID(transactionId, '', false, false);
        return res;
    } catch (error) {
        console.log("error in query block by transaction id.");
        throw newError(errType.FABRIC, error);
    }
}

module.exports.getBlockListByRange = async function(network, startBlock, endBlock) {
    var blockList = [];
    try {
        await network.addBlockListener('listener', async(err, block) => {
            if(!block) {
                
            }
            blockList.push(block);

        }, {startBlock: startBlock, endBlock: endBlock})

        if(blockList.length == (endBlock - startBlock + 1)) {
            return blockList;
        }

    } catch (error) {
        console.log("error in getBlockListByRange! : ", error);
        throw newError(errType.FABRIC, error);
    }
}

async function walletChecker(userName) {
    const userExists = wallet.exists(userName);
    if(!userExists) {
        console.log("non exists user (", userName, ") in wallet." );
        return false;
    }else {
        return true;
    }
} 