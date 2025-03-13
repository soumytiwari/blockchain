const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1');


const privateKey = "b2e398db32d1c462498a2ce99d515d286c575e96346ad23e741871abc34ce216"
const publicKey = "04fab2b96e219d0f53257ef690c37e093ad0b53bb3cf62725a76101c29afd22a97316e70e5b8e28bbcaebdb2adf19db5a2c0ea72b68676f1beb3c136e1e89f3a1b"
let message = "hello";

const hash = SHA256(JSON.stringify(message)).toString();
const keypair = ec.keyFromPrivate(privateKey, 'hex');
const signature = keypair.sign(hash, 'hex');
const isValid = ec.keyFromPublic(publicKey, 'hex').verify(hash, signature);

console.log(isValid)