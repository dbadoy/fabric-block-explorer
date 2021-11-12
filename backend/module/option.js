const Parser = require('./parser');

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
    if(!request.option) {
        request.option = Options.All;
        return Parser.defaultGet;
    }
    switch(request.option) {
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
        case Options.ChaincodeArgs:
            return Parser.getChaincodeArgs;
        case Options.RWset: // TODO :
            return Parser.getRWsetByChaincodeName;
        default:
            throw new Error();
    }
}