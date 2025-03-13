// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { QRCodeSVG } from 'qrcode.react';
// import { FaWallet, FaExchangeAlt, FaListAlt, FaCopy, FaShareSquare } from 'react-icons/fa';
// import './UserDashboard.css';
// import { signTransaction } from '../services/sign';

// const UserDashboard = () => {
//   const [activeSection, setActiveSection] = useState('wallet');
//   const [user, setUser] = useState({
//     publicKey: localStorage.getItem('public-key') || '',
//     balance: 0,
//     transactions: [],
//   });
//   const [message, setMessage] = useState('');
//   const [file, setfile] = useState(null);
//   const [payment, setPayment] = useState({
//     sender: '',
//     recipient: '',
//     amount: 0,
//     signature : ''
//   });
//   const [inputPublicKey, setInputPublicKey] = useState('');
//   const [isSigning, setSigning] = useState(false);
//   const [isPaymentProcessing, setPaymentProcessing] = useState(false); // Track payment status
//   const API = 'http://localhost:3100';
//   const navigate = useNavigate();

//   const fetchUserData = async (publicKey = user.publicKey) => {
//     try {
//       const response = await axios.post(`${API}/user`, { publicKey });
//       if (response.data) {
//         if(response.data.user === 'ADMIN'){
//           navigate('/a/dashboard')
//         }
//         setUser({
//           publicKey,
//           balance: response.data.balance,
//           transactions: response.data.transactions,
//         });
//         setMessage('');
//         localStorage.setItem('public-key', publicKey);
//       } else {
//         setMessage('No wallet found for the provided public key.');
//       }
//     } catch (error) {
//       setMessage('Error fetching user data.');
//     }
//   };

//   useEffect(() => {
//     if (user.publicKey) fetchUserData();
//   }, []);

//   const handleGetWallet = async () => {
//     if (inputPublicKey.trim()) {
//       await fetchUserData(inputPublicKey.trim());
//     } else {
//       setMessage('Please enter a valid public key.');
//     }
//   };

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     try {
//       setPayment({...payment,sender:user.publicKey})
//       if(!payment.amount || payment.amount<=0 || !payment.signature||!payment.sender||!payment.recipient){
//         setMessage('Transaction could not proceed, please verify')
//         return
//       }
//       setPaymentProcessing(true); // Set payment processing to true while payment is being processed
//       await axios.post(`${API}/create-transaction`, payment);
//       setMessage('Transaction sent successfully!');
//       setPayment({ recipient: '', amount: '',signature:'' });
//       fetchUserData();
//     } catch (error) {
//       setMessage('Error sending transaction. Please try again.');
//     } finally {
//       setPaymentProcessing(false); // Reset payment processing after completion
//     }
//   };

//   const handlePrivateKeyUpload = (e) => {
//     const file = e.target.files[0];
//     setfile(file)
//   };

//   const sign = async (e)=>{
//     e.preventDefault();
//     if(!payment.recipient || !payment.amount ) {
//       alert('Transaction Data empty');
//       return
//     }
//     setSigning(true);
//     const signature = await signTransaction({receiver: payment.recipient, amount: payment.amount},file)
//     setPayment({...payment,signature:signature})
//     if(!signature) {
//       alert('Private could not be found, Please select a private key file!');
//       setSigning(false);
//       return
//     }
//     setSigning(false);
//   }

//   const qrCodeElement = useMemo(() => {
//     return user.publicKey ? <QRCodeSVG value={user.publicKey} size={128} /> : null;
//   }, [user.publicKey]);

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'wallet':
//         return (
//           <div className="content">
//             <h2>Your Wallet</h2>
//             <p>
//               <strong>Public Key:</strong> {user.publicKey || 'No Public Key Found'}
//               <button className="icon-button" onClick={handleCopyKey}>
//                 <FaCopy size={18} />
//               </button>
//             </p>
//             {qrCodeElement}
//             <button className="icon-button" onClick={handleShareQR}>
//               <FaShareSquare size={18} />
//             </button>
//             <p>
//               <strong>Balance:</strong> {user.balance} CC
//             </p>
//           </div>
//         );
//       case 'transactions':
//         return (
//           <div className="content">
//             <h2>Transaction History</h2>
//             <ul>
//               {user.transactions.length > 0 ? (
//                 user.transactions.map((tx, index) => (
//                   <li key={index} className='user-transactions'>
//                     <p>
//                       <strong>Id : </strong> {tx.id}
//                     </p>
//                       {
//                         tx.input.address == user.publicKey?
//                         <p><strong>Recipient:</strong> {tx.outputs[1].address}</p> :
//                         <p><strong>Sender:</strong> {tx.input.address}</p>
//                       }
//                     <p>
//                       <strong>Amount:</strong> {tx.outputs[1].amount} CC
//                     </p>
//                     <p>
//                       <strong>Timestamp:</strong> {Date(tx.input.timestamp)}
//                     </p>
//                   </li>
//                 ))
//               ) : (
//                 <div>
//                   <h3>No transaction history</h3>
//                 </div>
//               )}
//             </ul>
//           </div>
//         );
//       case 'payment':
//         return (
//           <div className="content-payment">
//             <h2>Make a Payment</h2>
//             <form onSubmit={handlePayment} className="form">
//               <input
//                 type="text"
//                 placeholder="Recipient Address"
//                 value={payment.recipient}
//                 onChange={(e) => setPayment({ ...payment, recipient: e.target.value })}
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="Amount"
//                 value={payment.amount}
//                 onChange={(e) => setPayment({ ...payment, amount: parseInt(e.target.value)})}
//                 required
//               />
//               <label htmlFor="privatekey"></label>
//               <input type="file" id="privatekey" accept=".txt" onChange={handlePrivateKeyUpload} />
//               <div className="buttons">
//                 <button type="button" onClick={sign} disabled={isSigning || isPaymentProcessing}>
//                   {isSigning ? 'Signing...' : 'Sign Transaction'}
//                 </button>
//                 <button type="submit" disabled={isPaymentProcessing}>
//                   {isPaymentProcessing ? 'Processing...' : 'Send Payment'}
//                 </button>
//               </div>
//             </form>
//             {message && <p className="message">{message}</p>}
//           </div>
//         );
//       default:
//         return (
//           <div className="content">
//             <h2>Welcome to Your Dashboard</h2>
//           </div>
//         );
//     }
//   };

//   const handleCopyKey = () => {
//     if (user.publicKey) {
//       navigator.clipboard.writeText(user.publicKey)
//         .then(() => setMessage('Public key copied to clipboard!'))
//         .catch(err => setMessage('Failed to copy public key.'));
//     }
//   };

//   const handleShareQR = () => {
//     if (user.publicKey) {
//       const canvas = document.querySelector('canvas');
//       const dataUrl = canvas.toDataURL('image/png');
//       const link = document.createElement('a');
//       link.href = dataUrl;
//       link.download = 'qr-code.png';
//       link.click();
//     }
//   };

//   if (!user.publicKey) {
//     return (
//       <div className="no-wallet">
//         <h2>No Wallet Found</h2>
//         <p>It seems you don't have a wallet set up yet. Please enter Public Key or Create new wallet</p>
//         <div className="get-wallet-section">
//           <input
//             type="text"
//             placeholder="Enter Public Key"
//             value={inputPublicKey}
//             onChange={(e) => setInputPublicKey(e.target.value)}
//           />
//           <button onClick={handleGetWallet} className="get-wallet-button">
//             Get Wallet
//           </button>
//         </div>
//         {message && <p className="message">{message}</p>}
//         <button onClick={() => navigate('/wallet')} className="create-wallet-button">
//           Create Wallet
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard">
//       <div className="sidebar">
//         <button
//           className={activeSection === 'wallet' ? 'active' : ''}
//           onClick={() => setActiveSection('wallet')}
//         >
//           <FaWallet size={24} />
//           <span>Wallet</span>
//         </button>
//         <button
//           className={activeSection === 'transactions' ? 'active' : ''}
//           onClick={() => setActiveSection('transactions')}
//         >
//           <FaListAlt size={24} />
//           <span>Transactions</span>
//         </button>
//         <button
//           className={activeSection === 'payment' ? 'active' : ''}
//           onClick={() => setActiveSection('payment')}
//         >
//           <FaExchangeAlt size={24} />
//           <span>Payment</span>
//         </button>
//       </div>
//       <div className="main-content">{renderContent()}</div>
//     </div>
//   );
// };

// export default UserDashboard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WalletSection from '../components/WalletSection';
import TransactionsSection from '../components/TransactionSection';
import PaymentSection from '../components/PaymentSection';
import './UserDashboard.css';
import { FaWallet, FaExchangeAlt, FaListAlt } from 'react-icons/fa';

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('wallet');
  const [user, setUser] = useState({
    publicKey: localStorage.getItem('public-key') || '',
    balance: 0,
    transactions: [],
  });
  const [message, setMessage] = useState('');
  const API = 'http://localhost:3100';
  const navigate = useNavigate();

  const fetchUserData = async (publicKey = user.publicKey) => {
    try {
      const response = await axios.post(`${API}/user`, { publicKey });
      if (response.data) {
        if (response.data.user === 'ADMIN') navigate('/a/dashboard');
        setUser({
          publicKey,
          balance: response.data.balance,
          transactions: response.data.transactions,
        });
        setMessage('');
        localStorage.setItem('public-key', publicKey);
      } else {
        setMessage('No wallet found for the provided public key.');
      }
    } catch {
      setMessage('Error fetching user data.');
    }
  };

  useEffect(() => {
    if (user.publicKey) fetchUserData();
  }, []);

  const handleGetWallet = async (publicKey) => {
    await fetchUserData(publicKey.trim());
  };

  if (!user.publicKey) {
    return (
      <div className="no-wallet">
        <h2>No Wallet Found</h2>
        <p>Enter Public Key or Create a new wallet</p>
        <div className="get-wallet-section">
          <input
            type="text"
            placeholder="Enter Public Key"
            onChange={(e) => setUser({ ...user, publicKey: e.target.value })}
          />
          <button onClick={() => handleGetWallet(user.publicKey)}>Get Wallet</button>
        </div>
        {message && <p className="message">{message}</p>}
        <button onClick={() => navigate('/wallet')}>Create Wallet</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <button onClick={() => setActiveSection('wallet')} className={activeSection === 'wallet' ? 'active' : ''}>
          <FaWallet size={24} />
          <span>Wallet</span>
        </button>
        <button onClick={() => setActiveSection('transactions')} className={activeSection === 'transactions' ? 'active' : ''}>
          <FaListAlt size={24} />
          <span>Transactions</span>
        </button>
        <button onClick={() => setActiveSection('payment')} className={activeSection === 'payment' ? 'active' : ''}>
          <FaExchangeAlt size={24} />
          <span>Payment</span>
        </button>
      </div>
      <div className="main-content">
        {activeSection === 'wallet' && <WalletSection user={user} />}
        {activeSection === 'transactions' && <TransactionsSection transactions={user.transactions} user={user.publicKey} />}
        {activeSection === 'payment' && (
          <PaymentSection
            user={user}
            fetchUserData={fetchUserData}
            API={API}
            setMessage={setMessage}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

