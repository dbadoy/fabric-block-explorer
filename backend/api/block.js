const router = require("express").Router();

const parser = require("../module/parser");
const fabric = require("../module/fabirc");
const { newError, errType } = require("../module/errhandler");

//var gateway = await fabric.genFabricGateway(); // -> use singleton ?
//await init();

router.get('/', async(request, response) => {
    return response.status(200).json({payload : "success"})
})

// test
router.post('/testParse', async(request, response) => {
    var channelName = request.body.channelName;
    var blockNumber = request.body.blockNumber;
    try {
	var gateway = await fabric.genFabricGateway(); // -> use singleton ?
        const network = await fabric.getFabNetwork(gateway, channelName);
        const channel = await fabric.getFabChannel(network, channelName);

        const block = await fabric.getBlockByNumber(channel, blockNumber);

        const result = parser.getResponse(block.data.data[0]);

        return response.status(200).json({"payload": {"response": result}});

    } catch (error) {
        return response.status(400).json({"payload": error});
    }  
})

module.exports = router;
