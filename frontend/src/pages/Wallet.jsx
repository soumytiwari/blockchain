import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { saveAs } from 'file-saver';
import axios from 'axios';
import './Wallet.css';

const GetWallet = () => {
  const [wallet, setWallet] = useState({ publicKey: '', privateKey: '' });
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [customMessage, setCustomMessage] = useState(''); // User-provided message
  const [message, setMessage] = useState('');
  const API = 'http://localhost:3100';

  const navigate = useNavigate()
  const generateWallet = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.get(`${API}/create-wallet`);
      if (response.data.success) {
        const { publicKey, privateKey } = response.data.wallet;
        setWallet({ publicKey : publicKey, privateKey: privateKey});
        setMessage(response.data.message);
        localStorage.setItem("public-key", publicKey);
      } else {
        setMessage('Failed to create wallet. Please try again.');
      }
    } catch (error) {
      setMessage('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  const verifyKeys = async () => {
    if (!customMessage) {
      setVerificationMessage('Please enter a message for verification.');
      return;
    }
    setLoading(true);
    setVerificationMessage('');
    try {
      // Call backend to verify keys
      const response = await axios.post(`${API}/verify-key`, {
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        message: customMessage,
      });
      setVerificationMessage(response.data.isValid ? 'Keys are valid!' : 'Keys are invalid!');
    } catch (error) {
      setVerificationMessage('Key verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPrivateKey = () => {
    const blob = new Blob([wallet.privateKey], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'private_key.txt');
    setMessage('Private key downloaded. Do not share it with anyone!');
  };

  return (
    <div className="get-wallet-page">
      <header>
        <h1>
          <i className="fas fa-wallet"></i> Create Your Wallet
        </h1>
        <p>Generate and manage your wallet securely to interact with the blockchain.</p>
      </header>

      <div className="wallet-actions">
        {!wallet.privateKey && (
          <button onClick={generateWallet} className="btn-generate" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Wallet'}
          </button>
        )}

        {wallet.privateKey && (
          <>
            <div className="wallet-info">
              <h2>
                <i className="fas fa-key"></i> Wallet Details
              </h2>
              <p>
                <strong>Public Key:</strong>
                <textarea
                  readOnly
                  className="wallet-output"
                  value={wallet.publicKey}
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(wallet.publicKey);
                    setMessage('Public key copied to clipboard!');
                  }}
                  className="btn-copy"
                >
                  Copy and Save
                </button>
              </p>
              <p>
                <strong>Private Key:</strong>
                <textarea
                  readOnly
                  className="wallet-output"
                  value={wallet.privateKey}
                  onClick={(e) => e.target.select()}
                />
                <button onClick={downloadPrivateKey} className="btn-download">
                  Download Private Key
                </button>
              </p>
              <div className="verification-section">
                <h3>Verify Keys</h3>
                <p>Enter a message for verification:</p>
                <textarea
                  className="custom-message-input"
                  placeholder="Enter a message for verification"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
                <button onClick={verifyKeys} className="btn-verify" disabled={loading}>
                  Verify Keys
                </button>
                {verificationMessage && <p className="verification-message">{verificationMessage}</p>}
              </div>
              <button className="btn-verify" onClick={()=>navigate('/u/dashboard')}> Go To Dashboard</button>
            </div>
          </>
        )}

        {message && <p className="message">{message}</p>}
      </div>

      <section className="wallet-instructions">
        <h3>Important Instructions</h3>
        <ul>
          <li>
            <strong>Secure your private key:</strong> Never share it with anyone.
          </li>
          <li>
            <strong>Backup your private key:</strong> Save it in a safe location.
          </li>
          <li>
            <strong>Public key:</strong> Share this to receive payments.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default GetWallet;