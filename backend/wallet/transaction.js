const ChainUtil = require('../chain-util');
const { MINING_REWARD,INITIAL_BALANCE  } = require('../config');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(sender, recipient, amount) {
    const senderOutput = this.outputs.find(output => output.address === sender);

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static transactionWithOutputs(sender, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, sender);
    return transaction;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    }
  }

  static newTransaction(sender, recipient, amount, blockchain,sign, tp) {
    const {balance,_} = Transaction.calculateBalance(sender, blockchain ,tp);
    if (amount > balance) {
      console.log(`Amount: ${amount} exceeds balance: ${balance}.`);
      return
    }

    const transaction = new this();
    transaction.outputs.push(
      ...[
        { amount: balance-amount, address: sender },
        { amount, address: recipient }
      ]
    );
    transaction.input = {
      timestamp: Date.now(),
      amount: balance,
      address: sender,
      signature: sign
    }

    return transaction
  }

  static rewardTransaction(publickey, senderwallet) {
    return Transaction.transactionWithOutputs(senderwallet, [{
      amount: MINING_REWARD, address: publickey
    }]);
  }

  static calculateBalance(publicKey,blockchain, transactionPool) {
    let balance = INITIAL_BALANCE;
    let allTransactions = [];

    blockchain.chain.forEach(block => {
      block.data.forEach(transaction => {
        if (
          transaction.input.address === publicKey || 
          transaction.outputs.some(output => output.address === publicKey)
        ) {
          allTransactions.push(transaction);
        }
      });
    });
    transactionPool.transactions.forEach(transaction => {
      if (
        transaction.input.address === publicKey || 
        transaction.outputs.some(output => output.address === publicKey)
      ) {
        allTransactions.push(transaction);
      }
    });

  const walletInputTs = allTransactions
    .filter(transaction => transaction.input.address === publicKey);

  let startTime = 0;

  if (walletInputTs.length > 0) {
    const recentInputT = walletInputTs.reduce(
      (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
    );

    balance = recentInputT.outputs.find(output => output.address === publicKey).amount;
    startTime = recentInputT.input.timestamp;
  }

    allTransactions.forEach(transaction => {
      transaction.outputs.forEach(output => {
        if (output.address === publicKey) {
          if (!startTime || transaction.input?.timestamp > startTime) {
            balance += output.amount;
          }
        }
      });
    });
    return {balance : balance,allTransactions: allTransactions};
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;