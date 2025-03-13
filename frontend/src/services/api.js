import axios from 'axios';

const API_BASE = 'http://localhost:3100'; // Adjust to your server's address

export const getBlocks = () => axios.get(`${API_BASE}/blocks`);
export const getTransactions = () => axios.get(`${API_BASE}/transactions`);
export const postTransaction = (recipient, amount) =>
  axios.post(`${API_BASE}/transact`, { recipient, amount });
export const mineBlock = (data) =>
  axios.post(`${API_BASE}/mine`, { data });
export const mineTransactions = () => axios.get(`${API_BASE}/mine-transactions`);
export const getWalletPublicKey = () => axios.get(`${API_BASE}/public-key`);
