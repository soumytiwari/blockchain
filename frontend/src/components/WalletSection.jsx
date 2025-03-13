import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';


const WalletSection = ({ user }) => {
const [copyStatus, setCopyStatus] = useState(false);
  const handleCopyKey = () => {
    navigator.clipboard
      .writeText(user.publicKey)
      .then(() => setCopyStatus(true))
      .catch(() => setCopyStatus(false));
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleShareQR = () => {
    alert('Cannot Share yet')
  };

  return (
    <div className="wallet-section">
      <h2>Your Wallet</h2>

      {/* Public Key */}
      <div className="wallet-item">
        <label className="wallet-label">Public Key</label>
        <div className="wallet-value">
          <div className="wallet-box">{user.publicKey || 'No Public Key Found'}</div>
          <button className="wallet-button" onClick={handleCopyKey}>
            {copyStatus ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="wallet-item">
        <label className="wallet-label">Balance</label>
        <div className="wallet-box">{user.balance} CC</div>
      </div>

      {/* QR Code */}
      <div className="wallet-item">
        <label className="wallet-label">QR Code</label>
        <div className="wallet-qr">
          {user.publicKey && <QRCodeSVG value={user.publicKey} size={128} />}
        </div>
        <button className="wallet-button" onClick={handleShareQR}>
          Share QR
        </button>
      </div>
    </div>
  );
};

export default WalletSection;
