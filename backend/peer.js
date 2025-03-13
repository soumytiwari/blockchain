const WebSocket = require('ws');

// const MESSAGE_TYPES = {
//   chain: 'CHAIN',
//   transaction: 'TRANSACTION',
//   clear_transactions: 'CLEAR_TRANSACTIONS',
// };


// socket.onopen = function(event) {
//   // Handle connection open
// };

// socket.onmessage = function(event) {
//   // Handle received message
// };

// socket.onclose = function(event) {
//   // Handle connection close
// };

// function sendMessage(message) {
//   socket.send(message);
// }


///////////////

class Peer {
  constructor() {
    this.socket
    this.blockchain = null;
    this.transactionPool = [];
  }

  start() {
    console.log('Connecting to BlockChain');
    this.socket = new WebSocket('ws://localhost:5001');
  }

  // Connect to each known peer in the PEERS list
//   connectToKnownPeers() {
//     PEERS.forEach((peerUrl) => {
//       const socket = new WebSocket(peerUrl);
//       socket.on('open', () => this.connectSocket(socket));
//       socket.on('error', (err) => {
//         console.log(`Error connecting to peer: ${peerUrl}, ${err.message}`);
//       });
//     });
//   }

  // Handle the connection to a peer (add to sockets array)
//   connectSocket(socket) {
//     this.sockets.push(socket);
//     console.log(`Connected to peer. Total connections: ${this.sockets.length}`);

//     // Handle incoming messages from the connected peer
//     this.handleMessages(socket);

//     // Sync the blockchain if it's already loaded
//     if (this.blockchain) {
//       this.syncChain(socket);
//     }
//   }

  // Handle incoming messages from peers (chain, transaction, clear transactions)
//   handleMessages(socket) {
//     socket.on('message', (message) => {
//       const data = JSON.parse(message);

//       switch (data.type) {
//         case MESSAGE_TYPES.chain:
//           console.log('Received chain from peer.');
//           this.replaceChain(data.chain);
//           break;

//         case MESSAGE_TYPES.transaction:
//           console.log('Received transaction from peer.');
//           this.addTransaction(data.transaction);
//           break;

//         case MESSAGE_TYPES.clear_transactions:
//           console.log('Received clear transactions message from peer.');
//           this.clearTransactionPool();
//           break;

//         default:
//           console.log('Unknown message type:', data.type);
//       }
//     });
//   }

  // Sync the blockchain with a connected peer
//   syncChain(socket) {
//     console.log('Sending current chain to peer.');
//     socket.send(
//       JSON.stringify({
//         type: MESSAGE_TYPES.chain,
//         chain: this.blockchain,
//       })
//     );
//   }

//   // Broadcast a message to all connected peers (chain or transaction)
//   broadcast(type, data) {
//     this.sockets.forEach((socket) => {
//       socket.send(
//         JSON.stringify({
//           type,
//           ...data,
//         })
//       );
//     });
//   }

//   // Replace the local blockchain with a longer one received from a peer
//   replaceChain(newChain) {
//     if (!this.blockchain || newChain.length > this.blockchain.length) {
//       console.log('Replacing local blockchain with received chain.');
//       this.blockchain = newChain;
//     } else {
//       console.log('Received chain is not longer. No replacement done.');
//     }
//   }

//   // Add a new transaction to the local transaction pool
//   addTransaction(transaction) {
//     this.transactionPool.push(transaction);
//     console.log('Transaction added to local pool:', transaction);
//   }

//   // Clear the local transaction pool
//   clearTransactionPool() {
//     this.transactionPool = [];
//     console.log('Transaction pool cleared.');
//   }
// }
}

// Initialize and start the peer
const peer = new Peer();
peer.start();
