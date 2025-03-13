import { ec } from 'elliptic';
import sha256 from 'crypto-js/sha256';


const EC = new ec('secp256k1');

// Read private key from file input
function readPrivateKeyFromFile(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = function (e) {
      const privateKey = e.target.result.trim(); // Remove any extra spaces or newlines
      resolve(privateKey);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function signTransaction(transactionData,file) {
    const privateKey = await readPrivateKeyFromFile(file);
    return signWithPrivateKey(transactionData, privateKey);
}

// Sign the transaction using the private key
function signWithPrivateKey(transactionData, privateKey) {
  const keyPair = EC.keyFromPrivate(privateKey);
  const dataHash = sha256(JSON.stringify(transactionData)).toString();
  const signature = keyPair.sign(dataHash).toDER('hex');
  return signature;
}
