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

    async Initial() {
        try {
            this.Gateway = await fabric.genFabricGateway(); 
            this.Network = await fabric.getFabNetwork(this.Gateway, this.ChannelName);
            this.Channel = await fabric.getFabChannel(this.Network, this.ChannelName);
        } catch (error) {
            throw error;
        }
    }

    getChannelName() {
        return this.ChannelName;
    }

    getAllContract() {
        if(this.Contract.length == 0) {
            throw newError(errType.POOL, "no Contract in pool");
        }
        return this.Contract;
    }

    async getContractByName(contractName) {
        for await(const ctr of this.Contract) {
            if(ctr.ContractName == contractName) {
                return ctr;
            }
        }
        throw newError(errType.POOL, "non exist contract! : ", contractName)
    }

    async setContract(contractName) {
        try {
            var object = {
                "ContractName": null,
                "Contract": null
            };

            object.ContractName = contractName;
            object.Contract = await fabric.getFabContract(this.ContractName);

            this.Contract.push(object);
        } catch (error) {
            throw error;
        }
    }

    build() {
        if(this.isConnect == true) { return newError(errType.POOL, "already connected!"); }
        if(this.ChannelName && this.Gateway && this.Channel) { this.isConnect = true; } 
    }

    async disconnect() {
        try {
            await fabric.FabricDisconnection(this.Gateway, this.Channel);
            this.isConnect = false;
        } catch (error) {
            throw error;
        }
    }
}

class PoolGroup {
    constructor() {
        this.List = [];
    }

    addPool(poolName, pool) {
        if(!pool.isConnect) {
            throw newError(errType.POOL, "initial, build first!");
        }

        var object = {
            PoolName: null,
            Pool: null
        };

        object.PoolName = poolName;
        object.Pool = pool;

        this.List.push(object);
        console.log("success addPool")
    }

    refreshPoolGroup() {
        for(var i = 0; i < this.List.length; i++) {
            if(!this.List[i].Pool.isConnect) {
                delete this.List[i];
                this.List = this.List.filter(null);
            }
        }
    }

    async delPool(poolName) {
        try {
            // TODO: need check ...
            var pool = await this.getPoolByName(poolName); 
            await pool.Pool.disconnect();
            this.refreshPoolGroup();
        } catch (error) {
            throw error;
        }
    }

    async getPoolByName(poolName) {
        for await(const item of this.List) {
            if(item.PoolName == poolName) {
                return item.Pool;
            }
        }
        throw newError(errType.POOL, "non exists pool name : ", poolName);
    }

    getAllPool() {
        return this.List;
    }

    async getAllPoolName() {
        var arr = [];
        if(this.List.length == 0) {
            throw newError(errType.POOL, "empty pool");
        }

        for await(const item of this.List) {
            arr.push(item.PoolName);
        }
        return arr;
    }
}

module.exports.createPool = function(channelName) {
    return new Pool(channelName);
}

module.exports.PoolGroup = new PoolGroup();
