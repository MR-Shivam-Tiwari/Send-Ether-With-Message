import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

function Metamask() {

  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sendAmount, setSendAmount] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [message, setMessage] = useState("");
  


  //  For Connect Wallet with MetaMask

  const connectWallet = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {
          accountChanged(result[0]);
        })
        .catch(error => {
          setErrorMessage('Failed to connect wallet');
        });
    } else {
      setErrorMessage('Please install Metamask to connect wallet');
    }
  }

  const accountChanged = (accountName) => {
    setDefaultAccount(accountName);
    getUserBalance(accountName);
  }


  // Check And Render Ballance

  const getUserBalance = (accountAddress) => {
    window.ethereum.request({ method: 'eth_getBalance', params: [String(accountAddress), 'latest'] })
      .then(balance => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch(error => {
        setErrorMessage('Failed to get user balance');
      });
  }


  // amount Send Transaction

  const sendTransaction = () => {
    const value = ethers.utils.parseEther(sendAmount.toString());
    const options = { gasLimit: 1000000, value: value };
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

    signer.sendTransaction({ to: recipientAddress, ...options, data: ethers.utils.toUtf8Bytes(message) })
      .then((tx) => {
        setTransactionHistory(prevHistory => [
          ...prevHistory,
          {
            hash: tx.hash,
            to: recipientAddress,
            amount: sendAmount,
            message: message
          }
        ]);
        window.alert('Transaction sent successfully!');
      })
      .catch(error => {
        setErrorMessage('Failed to send transaction');
      });
  }

  // Render Transaction Hitory 
  
  const renderTransactionHistory = () => {
    return transactionHistory.map((transaction, index) => {
      return (
        <div key={index}>
          <p>Transaction Hash: {transaction.hash}</p>
          <p>To: {transaction.to}</p>
          <p>Amount: {transaction.amount}</p>
          <p>Message: {transaction.message}</p>
        </div>
      );
    });
  }

  return (

    // First Div

    <div>
      <h1 id='sen'>Send Ether with a Message</h1>
      <button onClick={connectWallet} id="con">Connect Metamask Wallet</button>
      <h2 id='add'>Address: {defaultAccount}</h2>
      <h2 id='bal'>Balance: {userBalance}</h2>
      {errorMessage && <p>{errorMessage}</p>}


      {/* Second Div */}

      <div >
        <label id='dive'>Amount(in Ether):</label>
        <input type="number" id="sendAmount" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />


        <label id='dive'>Send Ether to this Address:</label>
        <input type="text" id="recipientAddress" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />


        <div>
          <label id='mes'>Message:</label>
          <textarea id="message" rows="3" cols="77" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        <button onClick={sendTransaction} id="send">Send</button>
      </div>

      <hr />


      {/* Third Div */}

      <h2>Transaction History ( Message Tab )</h2>
      <ul>
        {transactionHistory.map((tx, index) => (
          <li key={index}>
            <div>Transaction {index + 1}</div>
            <div>Message: {tx.message}</div>
            <div>Address: {tx.to}</div>
            <div>Amount: {tx.amount} Ether</div>
          </li>
        ))}
      </ul>

    </div>
  );

}

export default Metamask;
