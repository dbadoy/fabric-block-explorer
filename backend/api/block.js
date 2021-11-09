const router = require("express").Router();

const parser = require("../module/parser");
const fabric = require("../module/fabric");
const { createPool, PoolGroup } = require("../module/pool");
const { setResponse } = require("../module/message");
const { newError, errType } = require("../module/errhandler");
const { request } = require("express");

router.get('/', async(request, response) => {
    return setResponse(response, 200, "success"); 
});

router.post('/createPool', async(request, response) => {
    console.log('start createPool.');

    const { channelName } = request.body;
    var newPool = createPool(channelName);

    try {
        await newPool.Initial();
        newPool.build();            
    } catch (error) {
        return setResponse(response, 400, error);
    }

    PoolGroup.addPool(channelName, newPool);

    return setResponse(response, 200, channelName); 
});

router.get('/getPool/:poolName', async(request, response) => {
    console.log('start getPool.');

    const { poolName } = request.params;
    try {
        const res = await PoolGroup.getPoolByName(poolName);
        return setResponse(response, 200, res);
    } catch (error) {
        return setResponse(response, 400, error);
    }
});

router.get('/getPoolGroup', async(request, response) => {
    console.log('start getPoolGroup.');
    try {
        const res = await PoolGroup.getAllPoolName();
        return setResponse(response, 200, res); 
    } catch (error) {
        return setResponse(response, 400, error); 
    }
});

router.delete('/deletePool/:poolName', async(request, response) => {
    console.log('start delPool.');

    const { poolName } = request.params;
    
    try {
        await PoolGroup.delPool(poolName);
        const res = await PoolGroup.getAllPoolName();
        return setResponse(response, 400, res);
    } catch (error) {
        return setResponse(response, 400, error);
    }
});

router.get('/getBlockByNumber/:channelName/:blockNumber', async(request, response) => {
    console.log('start getBlockByNumber');

    const { channelName, blockNumber } = request.params;

    try {
	    const chanPool = await PoolGroup.getPoolByName(channelName);

        const block = await fabric.getBlockByNumber(chanPool.Channel, blockNumber);
        const dataList = await parser.getDataList(block);

        var result = [];
        for await(const data of dataList) {
            result.push(parser.getResponse(data));
        }
        return setResponse(response, 200, result); 
    } catch (error) {
        return setResponse(response, 400, error);
    }  
});

router.get('/getBlockByTxId/:channelNmae/:txId', async(request, response) => {
    console.log('start getBlockByTxId');

    const { channelName, txId } = request.params;

    try {
        const chanPool = await PoolGroup.getPoolByName(channelName);
        const res = await fabric.getBlockByTxId(chanPool.Channel, txId);
        return setResponse(response, 200, res);
    } catch (error) {
        return setResponse(response, 400, error);
    }
});

router.get('/getBlockByRange/:channelName/:startBlock/:endBlock', async(request, response) => {
    console.log('start getBlockByRange');

    const { channelName, startBlock, endBlock } = request.params;

    try {
        if(startBlock > endBlock) {
            return setResponse(response, 400, newError(errType.FABRIC, ''));   
        }

        const chanPool = await PoolGroup.getPoolByName(channelName);
        const res = await fabric.getBlockListByRange(chanPool.Network, startBlock, endBlock);

        return setResponse(response, 200, res);
    } catch (error) {
        return setResponse(response, 400, error);
    }
});

router.get('/getBlockHeight/:channelName', async(request, response) => {
    console.log('start getBlockHeight');

    const { channelName } = request.params;

    try {
        // TODO: add logic for get block height. in module/fabric.js
    } catch (error) {
        
    }
})

module.exports = router;
