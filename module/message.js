const { OptionRouter }  = require('./option');

module.exports.getBlockParser = function(request) {
    return OptionRouter(request);
}

module.exports.setResponse = function(response, code, context) {
    console.log("action code : ", code);
  
    switch(code / 100) {
        case 2:
            return response.status(code).json({"payload" : context, "error" : null});
        case 4:
            return response.status(code).json({"payload" : null, "error" : context});
        default:
            return response.status(code).json({"payload" : null, "error" : context}); 
    }
}