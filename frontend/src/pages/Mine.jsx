import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Mine.css';

const MinePage = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [miningStatus, setMiningStatus] = useState('idle');
  const [transactionFeedback, setTransactionFeedback] = useState('');
  const [recentBlock, setRecentBlock] = useState(null);
  const [inputWallet, setInputWallet] = useState('');
  const URL = 'http://localhost:3100';

  useEffect(() => {
    const savedWalletAddress = localStorage.getItem('miner-key');
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress);
      setWalletConnected(true);
    }
  }, []);

  useEffect(() => {
    if (walletConnected) {
      fetchBalance();
      fetchRecentBlock();
    }
  }, [walletConnected]);

  const connectWallet = () => {
    if (!inputWallet) {
      setTransactionFeedback('Please enter a valid wallet address.');
      return;
    }
    setWalletAddress(inputWallet);
    setWalletConnected(true);
    localStorage.setItem('miner-key', inputWallet);
    setTransactionFeedback('Wallet connected successfully!');
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setWalletConnected(false);
    localStorage.removeItem('miner-key');
    setTransactionFeedback('Wallet disconnected.');
  };

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`/api/balance?address=${walletAddress}`);
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchRecentBlock = async () => {
    try {
      const response = await axios.get('/api/recent-block');
      setRecentBlock(response.data.block);
    } catch (error) {
      console.error('Error fetching recent block:', error);
    }
  };

  const mineBlock = async () => {
    if (!walletConnected) {
      setTransactionFeedback('Please connect your wallet first.');
      return;
    }

    setMiningStatus('mining');
    setTransactionFeedback('Mining in progress...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const minedBlock = await axios.post(`${URL}/mine-transactions`, { address: walletAddress });
      setMiningStatus('completed');
      setTransactionFeedback(`Block mined successfully! Block hash: ${minedBlock.data.hash}`);
      fetchBalance();
    } catch (error) {
      setMiningStatus('failed');
      setTransactionFeedback('Mining failed, try again later.');
    }
  };

  return (
    <div className="mine-page">
      {!walletConnected ? (
        <div className="wallet-connect-section">
          <h2>Connect Your Wallet</h2>
          <p>Enter your wallet address to start mining and manage your balance.</p>
          <input
            type="text"
            value={inputWallet}
            onChange={(e) => setInputWallet(e.target.value)}
            placeholder="Enter Wallet Address"
            className="wallet-input"
          />
          <button onClick={connectWallet} className="btn-primary">
            Connect Wallet
          </button>
          {transactionFeedback && <p className="feedback">{transactionFeedback}</p>}
        </div>
      ) : (
        <div className="wallet-details-section">
          <div className="wallet-info">
            <h2>Your Wallet</h2>
            <p>
              <strong>Wallet Address:</strong>
              <span className="wallet-address">{walletAddress}</span>
            </p>
            <p>
              <strong>Balance:</strong> {balance} CC
            </p>
            <button onClick={disconnectWallet} className="btn-secondary">
              Disconnect Wallet
            </button>
          </div>

          <div className="mining-section">
            <h2>Mine a Block</h2>
            <p>
              Start mining to validate transactions and earn rewards. Mining status will be updated
              in real time.
            </p>
            <div className="mining-status">
              <strong>Status:</strong>
              <span className={`status-badge ${miningStatus}`}>
                {miningStatus === 'idle'
                  ? 'Ready to Mine'
                  : miningStatus === 'mining'
                  ? 'Mining in Progress...'
                  : miningStatus === 'completed'
                  ? 'Mining Completed'
                  : 'Mining Failed'}
              </span>
            </div>
            <button
              onClick={mineBlock}
              disabled={miningStatus === 'mining'}
              className="btn-primary"
            >
              Start Mining
            </button>
            {transactionFeedback && <p className="feedback">{transactionFeedback}</p>}
          </div>

          {recentBlock && (
            <div className="recent-block-section">
              <h2>Recent Block</h2>
              <p>
                <strong>Block Height:</strong> {recentBlock.height}
              </p>
              <p>
                <strong>Block Hash:</strong> {recentBlock.hash}
              </p>
              <p>
                <strong>Difficulty:</strong> {recentBlock.difficulty}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MinePage;
