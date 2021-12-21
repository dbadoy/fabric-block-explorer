const Parser = require('./parser');

module.exports.ParseBlockWithOpt = ParseBlockWithOpt;
module.exports.ParseBlockListWithOpt = ParseBlockListWithOpt;

// how to solve RWset ( contractname )
async function ParseBlockWithOpt(parser, block) {
    var result = []; 

    if(parser == Parser.defaultGet) {
        return block;
    }

    var dataList = Parser.getDataList(block);
    for await(const data of dataList) {
        var obj = {
            "transactionId" : Parser.getTransactionId(data),
            "result" : null
        }
        var parsedData = parser(data);

        obj.result = parsedData;
        result.push(obj);
    }
    return result;
}

async function ParseBlockListWithOpt(parser, blockList) {
    var result = [];

    if(parser == Parser.defaultGet) {
        return blockList;
    }

    for await(const block of blockList) {
        var obj = {
            "blockNumber" : block.header.number,
            "result" : null 
        }
        var parsedBlock = await ParseBlockWithOpt(parser, block);

        obj.result = parsedBlock;
        result.push(obj);
    }
    return result;
}
//

const Options = {
    All : 0,
    Response : 1,
    ChannelName : 2,
    Timestamp : 3,
    TransactionId : 4,
    ChaincodeName : 5,
    ChaincodeAgrs : 6,
    RWset : 7
}

module.exports.OptionRouter = function(request) {
    if(!request.body.option) {
        request.body.option = Options.All;
        return Parser.defaultGet;
    }
    switch(request.body.option) {
        case Options.All:
            return Parser.defaultGet;
        case Options.Response:
            return Parser.getResponse;
        case Options.ChannelName:
            return Parser.getChannelName;
        case Options.Timestamp:
            return Parser.getTimestamp;
        case Options.TransactionId:
            return Parser.getTransactionId;
        case Options.ChaincodeName:
            return Parser.getChaincodeName;
        case Options.ChaincodeAgrs:
            return Parser.getChaincodeArgs;
        case Options.RWset:
            return Parser.getRWset;
        default:
            throw new Error("unknown option");
    }
}
