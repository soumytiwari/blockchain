import React, { useState } from 'react';
import { signTransaction } from '../services/sign';

const PaymentSection = ({ user, fetchUserData, API, setMessage }) => {
  const [payment, setPayment] = useState({ recipient: '', amount: '', signature: '' });
  const [privateKeyFile, setPrivateKeyFile] = useState(null); // State for storing the private key file
  const [isSigning, setSigning] = useState(false);
  const [isProcessing, setProcessing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPrivateKeyFile(file);
  };

  const handleSign = async () => {
    if (!privateKeyFile) {
      setMessage('Please upload your private key file.');
      return;
    }
    setSigning(true);

    const signature = await signTransaction(
      { receiver: payment.recipient, amount: payment.amount },
      privateKeyFile
    );

    if (signature) {
      setPayment({ ...payment, signature });
      setMessage('Transaction signed successfully!');
    } else {
      setMessage('Failed to sign the transaction. Please try again.');
    }

    setSigning(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!payment.signature) {
      setMessage('Please sign the transaction before proceeding.');
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch(`${API}/create-transaction`, {
        method: 'POST',
        body: JSON.stringify({ ...payment, sender: user.publicKey,amount: parseFloat(payment.amount)}),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setMessage('Payment successful!');
        fetchUserData();
        setPayment({ recipient: '', amount: 0, signature: '' });
        setPrivateKeyFile(null);
      } else {
        setMessage('Payment failed. Please try again.');
      }
    } catch {
      setMessage('An error occurred during payment processing.');
    }

    setProcessing(false);
  };

  return (
    <div className="content-payment">
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit} className='form'>
        <input
          type="text"
          placeholder="Recipient Address"
          value={payment.recipient}
          onChange={(e) => setPayment({ ...payment, recipient: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Amount"
          value={payment.amount}
          onChange={(e) => setPayment({ ...payment, amount: e.target.value})}
          required
        />
        <label htmlFor="privateKeyFile">Upload Private Key</label>
        <input
          type="file"
          id="privateKeyFile"
          accept=".txt"
          onChange={handleFileChange}
          required
        />
        <div className="buttons">
          <button type="button" onClick={handleSign} disabled={isSigning || isProcessing}>
            {isSigning ? 'Signing...' : 'Sign Transaction'}
          </button>
          <button type="submit" disabled={!payment.signature || isProcessing}>
            {isProcessing ? 'Processing...' : 'Send Payment'}
          </button>
        </div>
      </form>
      {setMessage && <p>{setMessage}</p>}
    </div>
  );
};

export default PaymentSection;
