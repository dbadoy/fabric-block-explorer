const router = require("express").Router();

const parser = require("../module/parser");
const fabric = require("../module/fabric");

const { setResponse } = require("../module/message");
const { newError, errType } = require("../module/errhandler");

const { PoolGroup } = require("../module/pool");

router.get('/', async(request, response) => {
    console.log(PoolGroup);
    return setResponse(response, 200, "success"); 
});

router.get('/blockByNumber/:channelName/:blockNumber', async(request, response) => {
    console.log('start getBlockByNumber');

    const { channelName, blockNumber } = request.params;

    try {
	    const chanPool = await PoolGroup.getPoolByName(channelName);

        const block = await fabric.getBlockByNumber(chanPool.Channel, Number(blockNumber));
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

router.get('/blockByTxId/:channelNmae/:txId', async(request, response) => {
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

router.get('/blockByRange/:channelName/:startBlock/:endBlock', async(request, response) => {
    console.log('start getBlockByRange');

    const { channelName, startBlock, endBlock } = request.params;

    try {
        if(startBlock > endBlock) {
            return setResponse(response, 400, newError(errType.FABRIC, 'startBlock must be gt endBlock'));   
        }

        const chanPool = await PoolGroup.getPoolByName(channelName);

        const res = await fabric.getBlockListByRange(chanPool.Network, chanPool.getListenerId(), startBlock, endBlock);

        return setResponse(response, 200, res);
    } catch (error) {
        return setResponse(response, 400, error);
    }
});

router.get('/blockHeight/:channelName', async(request, response) => {
    console.log('start getBlockHeight');

    const { channelName } = request.params;

    try {
        // TODO: add logic for get block height. in module/fabric.js
    } catch (error) {
        
    }
})

module.exports = router;
