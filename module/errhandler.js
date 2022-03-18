const ErrType = {
    FABRIC: "error in fabric",
    PARSER: "error in parser",
    POOL: "error in fabric pool"
}

class errObject {
    type;
    message;

    constructor(type, message) {
        this.type = type;
        this.message = message;
    }

    GetMessage() {
        return this.message;
    }
}

module.exports.newError = function(type, message) {
    let err = new errObject(type, message);
    return new Error(JSON.stringify(err));
} 

module.exports.errType = ErrType;

