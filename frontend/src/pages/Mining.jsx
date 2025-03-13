import React from 'react';
import { mineBlock, mineTransactions } from '../services/api';
import { Container, Typography, Button } from '@mui/material';

const Mining = () => {
  const handleMineBlock = () => {
    mineBlock('Sample Block Data')
      .then(() => alert('Block mined successfully!'))
      .catch((err) => alert('Failed to mine block:', err.message));
  };

  const handleMineTransactions = () => {
    mineTransactions()
      .then(() => alert('Transactions mined successfully!'))
      .catch((err) => alert('Failed to mine transactions:', err.message));
  };

  return (
    <></>
  );
};

export default Mining;
