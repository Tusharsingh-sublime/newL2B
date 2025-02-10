const crypto = require('crypto-js');
const { AES, enc, HmacSHA256 } = crypto;

 const encrypt = (data) => {
    return AES.encrypt(data, process.env.SECRET_KEY || '').toString();
}

 const decrypt = (data) => {
    return AES.decrypt(data, process.env.SECRET_KEY || '').toString(enc.Utf8);
}

 const generateHash = (data) => {
    return HmacSHA256(data, process.env.HMAC_TOKEN || '').toString();
}

module.exports = {
    encrypt,
    decrypt,
    generateHash
}

