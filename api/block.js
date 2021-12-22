const router = require("express").Router();

const { ParseBlockWithOpt, ParseBlockListWithOpt } = require("../module/option");
const fabric = require("../module/fabric");

const { setResponse, getBlockParser } = require("../module/message");
const { newError, errType } = require("../module/errhandler");

const { PoolGroup } = require("../module/pool");

router.get('/', async(request, response) => {
    console.log(PoolGroup);
    return setResponse(response, 200, "success"); 
});

router.get('/blockByNumber/:channelName/:blockNumber', async(request, response) => {
    console.log('start getBlockByNumber');

    const { channelName, blockNumber } = request.params;
    const Parser = getBlockParser(request);

    console.log(channelName, blockNumber);

    try {
	    const chanPool = await PoolGroup.getPoolByName(channelName);

        const block = await fabric.getBlockByNumber(chanPool.Channel, Number(blockNumber));
        const result = await ParseBlockWithOpt(Parser, block);

        return setResponse(response, 200, result); 
    } catch (error) {
        return setResponse(response, 400, error);
    }  
});

router.get('/blockByTxId/:channelNmae/:txId', async(request, response) => {
    console.log('start getBlockByTxId');

    const { channelName, txId } = request.params;
    const Parser = getBlockParser(request);

    try {
        const chanPool = await PoolGroup.getPoolByName(channelName);

        const block = await fabric.getBlockByTxId(chanPool.Channel, txId);
        const result = await ParseBlockWithOpt(Parser, block);

        return setResponse(response, 200, result);
    } catch (error) {
        return setResponse(response, 400, error);
    }
});

router.get('/blockByRange/:channelName/:startBlock/:endBlock', async(request, response) => {
    console.log('start getBlockByRange');

    const { channelName, startBlock, endBlock } = request.params;
    const Parser = getBlockParser(request);

    try {
        if(Number(startBlock) > Number(endBlock)) {
            return setResponse(response, 400, newError(errType.FABRIC, 'startBlock must be gt endBlock'));   
        }

        const chanPool = await PoolGroup.getPoolByName(channelName);

        const blockList = await fabric.getBlockListByRange(chanPool.Network, chanPool.getListenerId(), startBlock, endBlock);
        const result = await ParseBlockListWithOpt(Parser, blockList);

        return setResponse(response, 200, result);
    } catch (error) {
        return setResponse(response, 400, error);
    }
});

router.get('/blockHeight/:channelName', async(request, response) => {
    console.log('start getBlockHeight');

    const { channelName } = request.params;

    try {
        const chanPool = await PoolGroup.getPoolByName(channelName);
        const result = await fabric.getBlockHeight(chanPool.Channel);
	    
	return setResponse(response, 200, result); 
    } catch (error) {
        return setResponse(response, 400, error);
    }
})

router.get('/organization/:channelName', async(request, response) => {
    console.log('start get organizations');

    const { channelName } = request.params;

    try {
        const chanPool = await PoolGroup.getPoolByName(channelName);
        const result = await fabric.getOrganization(chanPool.Channel);

        return setResponse(response, 200, result); 
    } catch (error) {
        return setResponse(response, 400, error);
    }
})

module.exports = router;
