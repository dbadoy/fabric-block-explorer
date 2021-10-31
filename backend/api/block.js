const router = require("express").Router();

const parser = require("../module/parser");
const fabric = require("../module/fabirc");
const { newError, errType } = require("./errhandler");

var gateway = await fabric.genFabricGateway(); // -> use singleton ?
await init();

router.get('/', async(request, response) => {
    return res.status(200).json({payload : "success"})
})

// test
router.post('/testParse', async(request, response) => {
    var channelName = request.body.channelName;
    try {
        const network = await fabric.getFabNetwork(gateway, channelName);
        const channel = await fabric.getFabChannel(network, channelName);

        const block = await fabric.getBlockByNumber(channel, 10);

        const result = parser.getBlockNumber(block);

        return response.status(200).json({"payload": {"blockNumber" : result}});

    } catch (error) {
        return response.status(400).json({"payload": error});
    }  
})