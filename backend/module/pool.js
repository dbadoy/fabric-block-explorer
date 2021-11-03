const fabric = require('./fabric');
const { newError, errType } = require("./errhandler");

class Pool { 
    constructor(channelName) {
        this.ChannelName = channelName;
        this.Contract = [];
        this.Gateway = null;
        this.Network = null;
        this.Channel = null;
        this.isConnect = false;   
    }

    Initial() {
        try {
            this.Gateway = await fabric.genFabricGateway(); 
            this.Network = await fabric.getFabNetwork(this.Gateway, this.ChannelName);
            this.Channel = await fabric.getFabChannel(this.Network, this.ChannelName);
        } catch (error) {
            return error;
        }
    }

    getChannelName() {
        return this.ChannelName;
    }

    getAllContract() {
        return this.Contract;
    }

    getContractByName(contractName) {
        for (const ctr of this.Contract) {
            if(ctr.ContractName == contractName) {
                return ctr;
            }
        }
    }

    setContract(contractName) {
        try {
            var object = {
                "ContractName": null,
                "Contract": null
            };

            object.ContractName = contractName;
            object.Contract = await fabric.getFabContract(this.ContractName);

            this.Contract.push(object);
        } catch (error) {
            return error;
        }
    }

    build() {
        if(this.isConnect == true) { return newError(errType.POOL, "already connected!"); }
        if(this.ChannelName && this.Gateway && this.Channel) { this.isConnect = true; } 
    }

    disconnect() {
        try {
            await fabric.FabricDisconnection(this.Gateway, this.Channel);
            this.isConnect = false;
        } catch (error) {
            return error;
        }
    }
}

class PoolGroup {
    constructor() {
        this.List = [];
    }

    addPool(poolName, pool) {
        if(!pool.isConnect) {
            return newError(errType.POOL, "initial, build first!");
        }

        var object = {
            PoolName: null,
            Pool: null
        };

        object.PoolName = poolName;
        object.Pool = pool;

        this.List.push(object);
    }

    getPoolByName(poolName) {
        for (const item of this.List) {
            if(item.PoolName == poolName) {
                return item.Pool;
            }
        }
    }

    getAllPool() {
        return this.List;
    }

    getAllPoolName() {
        var arr = [];
        for (const item of this.List) {
            arr.push(item.PoolName);
        }
        return arr;
    }

}

exports.module.createPool = async function(channelName) {
    return new Pool(channelName);
}

exports.module.PoolGroup = new PoolGroup();