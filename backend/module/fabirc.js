const path = require('path'); 

const { FileSystemWallet ,Gateway } = require('fabric-network');
const ccpPath = path.resolve(String(process.env.CONNECTIONORG1));

const walletPath = path.join(process.env.WALLT);
const wallet = new FileSystemWallet(walletPath);

const connectionOptions = {
    identity: process.env.FABRIC_CLIENT_ID,
    wallet: wallet,
    discovery: { enabled: true, asLocalhost: process.env.MULTIHOST},
} 

module.exports.genFabricGateway = async function() {
    if(!walletChecker(process.env.FABRIC_CLIENT_ID)) {
        return "TEMP ERROR"; // ##
    };
    const gateway = new Gateway();
    try {
        await gateway.connect(ccpPath, connectionOptions);    

        console.log("success to create gateway.");
        return gateway;
    } catch (error) {
        console.log("error in gateway connect! :", error);
        return "TEMP ERROR"; // ##
    }
}

module.exports.FabricGatewayClose = async function(gateway) { 
    try {
        gateway.disconnect();
    } catch(error) {
        console.log("error in gateway disconnect! : ", error);
        return "TEMP ERROR"; // ##
    }
}
module.exports.getFabNetwork = async function(gateway, channelName) {
    try {
        const network = await gateway.getNetwork(channelName);
        return network;
    } catch (error) {
        console.log("error in create network! : ", error);
        return "TEMP ERROR"; // ##
    }
}

module.exports.getFabChannel = async function(network, channelName) {
    try {
        const channel = await network.getChannel(channelName);
        return channel   
    } catch (error) {
        console.log("error in create channel! : ", error);
        return "TEMP ERROR"; // ##
    }
}

module.exports.getFabContract = async function(network, contractName) {
    try {
        const contract = await network.getContract(contractName);
        return contract;
    } catch (error) {
        console.log("error in cretae contract! : ", error);
        return "TEMP ERROR"; // ##
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