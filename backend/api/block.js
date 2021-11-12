const router = require("express").Router();

const { ParseBlockWithOpt, ParseBlockListWithOpt } = require("../module/parser");
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

    try {
        if(startBlock > endBlock) {
            return setResponse(response, 400, newError(errType.FABRIC, 'startBlock must be gt endBlock'));   
        }

        const chanPool = await PoolGroup.getPoolByName(channelName);

        const blockList = await fabric.getBlockListByRange(chanPool.Network, chanPool.getListenerId(), startBlock, endBlock);
        const result = await ParseBlockListWithOpt(blockList);

        return setResponse(response, 200, result);
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
