const router = require("express").Router();

const parser = require("../module/parser");
const fabric = require("../module/fabric");
const { creatPool, PoolGroup } = require("../module/pool");
const { newError, errType } = require("../module/errhandler");
const { request } = require("express");

router.get('/', async(request, response) => {
    return response.status(200).json({"response" : "success"})
})

router.post('/createPool', async(request, response) => {
    var channelName = request.body.channelName;
    var newPool = createPool(channelName);

    try {
        newPool.Initial();
        newPool.build();            
    } catch (error) {
        return response.status(400).json({"response": error});
    }

    PoolGroup.addPool(channelName, newPool);

    return response.status(200).json({"response": channelName});
})

router.get('/getPoolGroup', async(request, response) => {
    return response.status(200).json({"response": PoolGroup.getAllPoolName()});
})

// test
router.post('/getByBlockNumber', async(request, response) => {
    var channelName = request.body.channelName;
    var blockNumber = request.body.blockNumber;
    try {
	    const chanPool = PoolGroup.getPoolByName(channelName);

        const block = await fabric.getBlockByNumber(chanPool.Channel, blockNumber);
        const dataList = await parser.getDataList(block);

        var result = [];
        for await(const data of dataList) {
            result.push(parser.getResponse(data));
        }
        await fabric.FabricDisconnection(gateway, channel);
        return response.status(200).json({"response": result});
    } catch (error) {
        return response.status(400).json({"response": error});
    }  
})

module.exports = router;
