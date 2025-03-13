import React from 'react';

const TransactionsSection = ({ transactions , user}) => {
  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((tx, index) => (
            <li key={index} className='user-transactions'>
                <p>
                    <strong>ID:</strong> {tx.id}
                </p>
                {
                    tx.input.address == user?
                    <p><strong>Recipient:</strong> {tx.outputs[1].address}</p> :
                    <p><strong>Sender:</strong> {tx.input.address}</p>
                    }
                <p>
                    <strong>Amount:</strong> {tx.outputs[1].amount} CC
                </p>
                <p>
                    <strong>Timestamp:</strong> {new Date(tx.input.timestamp).toLocaleString()}
                </p>
            </li>
          ))
        ) : (
          <h3>No transaction history</h3>
        )}
      </ul>
    </div>
  );
};

export default TransactionsSection;
