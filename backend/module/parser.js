const bodyParser = require("body-parser");
const { newError, errType } = require("./errhandler");

// how to solve RWset ( contractname )
module.exports.ParseBlockWithOpt = async function(parser, block) {
    var result = []; 

    if(parser == this.defaultGet) {
        return block;
    }
    
    var dataList = this.getDataList(block);
    for await(const data of dataList) {
        var obj = {
            "transactionId" : this.getTransactionId(data),
            "result" : null
        }
        var parsedData = parser(data);

        obj.result = parsedData;
        result.push(obj);
    }
    return result;
}

module.exports.ParseBlockListWithOpt = async function(parser, blockList) {
    var result = [];

    if(parser == this.defaultGet) {
        return blockList;
    }

    for await(const block of blockList) {
        var obj = {
            "blockNumber" : block.header.number,
            "result" : null 
        }
        var parsedBlock = await this.ParseBlockWithOpt(block);

        obj.result = parsedBlock;
        result.push(obj);
    }
    return result;
}
//

module.exports.defaultGet = function(block) {
    return block;
}

module.exports.getBlockNumber = function(block) {
    return block.header.number;
}

module.exports.getSignerList = async function(block) {
    var signerList = [];
    var signatures = block.metadata.metadata[0].signatures;

    for await(const signature of signatures) {
        signerList.push(signature.signature_header.creator.Mspid);
    }
    return signerList;
}

module.exports.getDataList = function(block) {
    var dataArr = [];
    if(!block.data) {
        throw newError(errType.PARSER, "empty block.");
    }
    for (const data of block.data.data) {
        dataArr.push(data);
    }
    return dataArr;
}

// data
module.exports.getChannelName = function(data) {
    return data.payload.header.channel_header.channel_id;
}

module.exports.getTimestamp = function(data) {
    return data.payload.header.channel_header.timestamp;
}

module.exports.getTransactionId = function(data) {
    return data.payload.header.channel_header.tx_id;
}

// TODO : Wrapping ? duplicated logic ... check channel block .
module.exports.getChaincodeName = function(data) {
    if(!data.payload.data.actions) {
        throw newError(errType.PARSER, "this is channel block.");
    }
    return data.payload.data.actions[0].payload.action.proposal_response_payload.extension.chaincode_id.name;
}

module.exports.getEventName = function(data) {
    if(!data.payload.data.actions) {
        throw newError(errType.PARSER, "this is channel block.");
    }
    return data.payload.data.actions[0].payload.action.proposal_response_payload.extension.events;
}

module.exports.getResponse = function(data) {
    if(!data.payload.data.actions) {
        throw newError(errType.PARSER, "this is channel block.");
    }
    return data.payload.data.actions[0].payload.action.proposal_response_payload.extension.response;
    // { message : "", payload : "", status : 200 }
}

module.exports.getChaincodeArgs = function(data) {
    if(!data.payload.data.actions) {
        throw newError(errType.PARSER, "this is channel block.");
    }
    return data.payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args;
}

module.exports.getRWsetByChaincodeName = async function(data, chiancodeName) {
    if(!data.payload.data.actions) {
        throw newError(errType.PARSER, "this is channel block.");
    }
    var ns = data.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset;
    var rwset = [];
    for await(const v of ns) {
        if(v.namespace == chiancodeName) {
            rwset.push(v);
        }
    }
    return rwset;
}
