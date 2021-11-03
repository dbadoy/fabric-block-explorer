// skel
const ErrType = {
    FABRIC: "error in fabric",
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
    var err = new errObject(type, message);
    return err;
} 

module.exports.errType = ErrType;

