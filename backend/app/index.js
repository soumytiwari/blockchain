const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const TransactionPool = require('../wallet/transaction-pool');
const Transaction = require('../wallet/transaction')
const Miner = require('./miner');
const dotenv = require('dotenv');
const cors = require('cors');
const ChainUtil = require('../chain-util')
dotenv.config();

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);

app.use(cors());
app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();

  res.redirect('/blocks');
});

app.post('/user', (req, res) => {
  const {publicKey} = req.body;

  if(publicKey === process.env.ADMIN){
    return res.status(200).json({user: 'ADMIN'})
  }
  // Validate public key
  if (!ChainUtil.isValidAddress(publicKey)) {
    return res.status(400).json({ error: 'Invalid public key.' });
  }
  const {balance , allTransactions}= Transaction.calculateBalance(publicKey, bc,tp);
  res.json({ balance : balance, transactions: allTransactions });
});

app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});


app.post('/create-transaction', (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  try {
    // Validate public key, recipient, and signature
    if (!ChainUtil.isValidAddress(recipient)) {
      return res.status(400).json({ error: 'Invalid recipient address' });
    }

    const transaction = Transaction.newTransaction(sender,recipient,amount,bc,signature,tp);
    tp.updateOrAddTransaction(transaction);
    p2pServer.broadcastTransaction(transaction);
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

app.get('/create-wallet', (req, res) => {
  const keyPair = ChainUtil.genKeyPair();
  const privateKey = keyPair.getPrivate('hex')
  const publicKey = keyPair.getPublic('hex')

  res.json({
    success: true,
    message: 'Wallet created successfully!',
    wallet: {
      publicKey,
      privateKey,
    }
  });
});

app.post('/verify-key', (req, res) => {
  const { publicKey, privateKey, message } = req.body;

  if (!privateKey || !publicKey || !message) {
    return res.status(400).json({
      success: false,
      message: 'Private key, public key, and message are required.'
    });
  }

  try {
    const isValid = ChainUtil.isValidKey(publicKey,privateKey,message);
    res.json({
      success: true,
      isValid: isValid,
      message: isValid ? 'Keys are valid and verified!' : 'Keys do not match!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Keys could not be verified',
      error: error.message
    });
  }
});

app.post('/mine-transactions', (req, res) => {
  const { address } = req.body;
  const miner = new Miner(bc, tp, address, p2pServer)
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);
  res.status(200).json(block)
});


// app.get('/public-key', (req, res) => {
//   res.json({ publicKey: wallet.publicKey });
// });

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();