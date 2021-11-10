const router = require("express").Router();

const { setResponse } = require("../module/message");

const { PoolGroup } = require("../module/pool");
const { createPool } = require("../module/pool");

// router.get('/', async(request, response) => {
//     console.log(PoolGroup);
//     return setResponse(response, 200, "success"); 
// });

router.post('/', async(request, response) => {
    console.log('start createPool.');

    const { channelName } = request.body;
    var newPool = createPool(channelName);

    try {
        await newPool.Initial();
        newPool.Done();        

    } catch (error) {
        return setResponse(response, 400, error);
    }

    PoolGroup.addPool(channelName, newPool);

    return setResponse(response, 200, channelName); 
});

router.get('/:poolName', async(request, response) => {
    console.log('start getPool.');

    const { poolName } = request.params;
    try {
        const res = await PoolGroup.getPoolByName(poolName);
        return setResponse(response, 200, res);
    } catch (error) {
        return setResponse(response, 400, error);
    }
});

router.get('/group', async(request, response) => {
    console.log('start getPoolGroup.');
    try {
        const res = await PoolGroup.getAllPoolName();
        return setResponse(response, 200, res); 
    } catch (error) {
        return setResponse(response, 400, error); 
    }
});

router.delete('/:poolName', async(request, response) => {
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

module.exports = router;
