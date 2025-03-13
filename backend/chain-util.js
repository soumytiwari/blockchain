const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const { v1: uuidV1 } = require('uuid');
const ec = new EC('secp256k1');

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return uuidV1();
  }

  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }

  static isValidKey(publickey, privatekey, message){
    const hash = this.hash(message);
    const keyPair = ec.keyFromPrivate(privatekey, 'hex');
    const signature = keyPair.sign(hash, 'hex');
    const isValid = ec.keyFromPublic(publickey, 'hex').verify(hash, signature);
    return isValid
  }

  static verifySignature(publicKey, signature, dataHash) {
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }

  static isValidAddress(key) {
    try {
      const Key = ec.keyFromPublic(key, 'hex');
      return Key.validate().result;
    } catch (err) {
      return false;
    }
  }
}

module.exports = ChainUtil;