// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { FaCube, FaExchangeAlt, FaListAlt, FaHammer } from 'react-icons/fa';
import { signTransaction } from '../services/sign';

const Dashboard = () => {

  const sender = localStorage.getItem('public-key') || '';
  const [selectedSection, setSelectedSection] = useState('blocks');
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({ sender: sender, receiver: '', amount: '', signature:'' });
  const [isMining, setIsMining] = useState(false);
  const [isSigning, setSigning] = useState(false);
  const [file, setfile] = useState(false);

  useEffect(() => {
    fetchBlocks();
    fetchTransactions();
  }, []);

  const URL = 'http://localhost:3100'
  const fetchBlocks = async () => {
    const response = await axios.get(`${URL}/blocks`);
    setBlocks(response.data);
  };

  const fetchTransactions = async () => {
    const response = await axios.get(`${URL}/transactions`);
    setTransactions(response.data);
  };

  const handlePrivateKeyUpload = (e) => {
    const file = e.target.files[0];
    setfile(file)
  };

  const sign = async (e)=>{
    e.preventDefault();
    if( !newTransaction.sender || !newTransaction.receiver || !newTransaction.amount ) {
      alert('Transaction Data empty');
      return
    }
    setSigning(true);
    const signature = await signTransaction({receiver: newTransaction.receiver, amount: newTransaction.amount},file)
    if(!signature) {
      alert('Private could not be found, Please select a private key file!');
      setSigning(false);
      return
    }
    setNewTransaction({...newTransaction, signature : signature})
    setSigning(false);

  }

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!newTransaction.signature) {
      alert('Transaction must be signed before submission.');
      return;
    }
    const publicKey = localStorage.getItem('public-key') || '';
    if(publicKey === '') {
      alert('Public key could not be found in local storage');
      return;
    }
    setNewTransaction({...newTransaction, sender : publicKey})
    const response = await axios.post(`${URL}/create-transaction`, newTransaction);
    setNewTransaction({ sender: '', receiver: '', amount: '' , signature: ''});
    fetchTransactions();
  };

  const mineBlock = async () => {
    setIsMining(true);
    await axios.post(`${URL}/mine`);
    fetchBlocks();
    fetchTransactions();
    setIsMining(false);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'blocks':
        return (
          <div className="content">
            <h2>Blocks</h2>
            <div className="blocks">
              {blocks.map((block, index) => (
                <div className="block" key={index}>
                  <p><strong>Timestamp:</strong> {block.timestamp}</p>
                  <p><strong>Hash:</strong> {block.hash}</p>
                  <p><strong>Previous Hash:</strong> {block.lasthash}</p>
                  <p><strong>Nonce: </strong> {block.nonce}</p>
                  <p><strong>Difficulty:</strong> {block.difficulty}</p>
                  <p><strong>Data</strong> {5}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="content">
            <h2>Pending Transactions</h2>
            <ul>
              {transactions.map((tx, index) => (
                <li key={index} className='user-transactions'>
                  <p><strong>ID:</strong> {tx.id}</p>
                  <p><strong>Sender:</strong> {tx.input.address}</p>
                  <p><strong>Receiver:</strong> {tx.outputs[1].address}</p>
                  <p><strong>Amount:</strong> {tx.outputs[1].amount}</p>
                  <p><strong>Time:</strong> {Date(tx.input.timestamp)}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'addTransaction':
        return (
          <div className="content">
            <h2>Add New Transaction</h2>
            <form onSubmit={handleTransactionSubmit}>
              <input
                type="text"
                placeholder="Sender Address"
                value={newTransaction.sender}
                onChange={(e) => setNewTransaction({ ...newTransaction, sender: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Receiver Address"
                value={newTransaction.receiver}
                onChange={(e) => setNewTransaction({ ...newTransaction, receiver: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                required
              />
              <label htmlFor="privateKeyFile">Select Private Key</label>
              <input type="file" id="privateKeyFile" accept=".txt" onChange={handlePrivateKeyUpload}/>
              <button type="button" onClick={sign}>{isSigning? 'Signing...' :'Sign Transaction'}</button>
              <button type="submit">Add Transaction</button>

              <p></p>
            </form>
          </div>
        );
      case 'mine':
        return (
          <div className="content">
            <h2>Mine Block</h2>
            <button onClick={mineBlock} disabled={isMining}>
              {isMining ? 'Mining...' : 'Mine Block'}
            </button>
          </div>
        );
      default:
        return <div className="content"><h2>Select an Option</h2></div>;
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <button onClick={() => setSelectedSection('blocks')}>
          <FaCube size={24} />
          <span>Blocks</span>
        </button>
        <button onClick={() => setSelectedSection('transactions')}>
          <FaListAlt size={24} />
          <span>Transactions</span>
        </button>
        <button onClick={() => setSelectedSection('addTransaction')}>
          <FaExchangeAlt size={24} />
          <span>Add Transaction</span>
        </button>
        <button onClick={() => setSelectedSection('mine')}>
          <FaHammer size={24} />
          <span>Mine</span>
        </button>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
