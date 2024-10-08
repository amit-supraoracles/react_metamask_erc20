import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import './App.css'; 

const ERC20_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "initialSupply",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [spender, setSpender] = useState('');
  const [allowance, setAllowance] = useState('0');
  const [erc20Contract, setErc20Contract] = useState(null);
  const [walletToCheck, setWalletToCheck] = useState('');
  const [walletTokenBalance, setWalletTokenBalance] = useState('0');
  const [walletEthBalance, setWalletEthBalance] = useState('0');

  useEffect(() => {
    const init = async () => {
      try {
        const web3Modal = new Web3Modal({
          cacheProvider: true,
          providerOptions: {},
        });
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        setProvider(provider);

        const signer = provider.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();
        setAddress(address);

        const tokenAddress = '0x082Fd82aD86b5AfAD314E6e449492540A7e6A5C7'; // Replace with your actual ERC20 token address
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
        setErc20Contract(contract);

        updateBalances(contract, address, provider);
      } catch (error) {
        console.error('Error during wallet connection', error);
        alert('Error connecting to wallet. Please check your wallet connection.');
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (provider && address) {
      updateBalances(erc20Contract, address, provider);
    }
  }, [erc20Contract, provider, address]);

  const updateBalances = async (contract, address, provider) => {
    if (contract && address && provider) {
      try {
        const tokenBalance = await contract.balanceOf(address);
        setTokenBalance(ethers.utils.formatUnits(tokenBalance, 18));

        const ethBalanceWei = await provider.getBalance(address);
        const ethBalanceFormatted = Number(ethers.utils.formatEther(ethBalanceWei)).toFixed(6);
        setEthBalance(ethBalanceFormatted);
      } catch (error) {
        console.error('Error fetching balances', error);
      }
    }
  };

  const handleCheckWalletBalance = async () => {
    if (!erc20Contract || !walletToCheck) return;

    try {
      const tokenBalance = await erc20Contract.balanceOf(walletToCheck);
      setWalletTokenBalance(ethers.utils.formatUnits(tokenBalance, 18));

      const ethBalanceWei = await provider.getBalance(walletToCheck);
      const ethBalanceFormatted = Number(ethers.utils.formatEther(ethBalanceWei)).toFixed(6);
      setWalletEthBalance(ethBalanceFormatted);
    } catch (error) {
      console.error('Error fetching wallet balances', error);
      alert('Failed to fetch wallet balance. Please check the address.');
    }
  };

  const handleTransfer = async () => {
    if (!signer || !erc20Contract) return;

    try {
      const tx = await erc20Contract.connect(signer).transfer(recipient, ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      alert('Transfer successful');
      updateBalances(erc20Contract, address, provider);
    } catch (error) {
      console.error('Transfer failed', error);
      alert('Transfer failed');
    }
  };

  const handleApprove = async () => {
    if (!signer || !erc20Contract) return;

    try {
      const tx = await erc20Contract.connect(signer).approve(spender, ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      alert('Approval successful');
    } catch (error) {
      console.error('Approval failed', error);
      alert('Approval failed');
    }
  };

  const checkAllowance = async () => {
    if (!erc20Contract) return;

    try {
      const allowance = await erc20Contract.allowance(address, spender);
      setAllowance(ethers.utils.formatUnits(allowance, 18));
    } catch (error) {
      console.error('Error checking allowance', error);
    }
  };

  return (
    <div className="App">
      <h1>ERC20 Token Operations</h1>
      <p><strong>Address:</strong> {address}</p>
      <p><strong>Token Balance:</strong> {tokenBalance} Tokens</p>
      <p><strong>Ether Balance (ETH):</strong> {ethBalance} ETH</p>

      <div>
        <h2>Transfer ERC20 Token</h2>
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleTransfer}>Transfer</button>
      </div>

      <div>
        <h2>Approve Spender</h2>
        <input
          type="text"
          placeholder="Spender address"
          value={spender}
          onChange={(e) => setSpender(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleApprove}>Approve</button>
      </div>

      <div>
        <h2>Check Allowance</h2>
        <input
          type="text"
          placeholder="Spender address"
          value={spender}
          onChange={(e) => setSpender(e.target.value)}
        />
        <button onClick={checkAllowance}>Check Allowance</button>
        <p><strong>Allowance:</strong> {allowance} Tokens</p>
      </div>

      <div>
        <h2>Check Wallet Balance</h2>
        <input
          type="text"
          placeholder="Wallet address"
          value={walletToCheck}
          onChange={(e) => setWalletToCheck(e.target.value)}
        />
        <button onClick={handleCheckWalletBalance}>Check Balance</button>
        <p><strong>Token Balance:</strong> {walletTokenBalance} Tokens</p>
        <p><strong>Ether Balance (ETH):</strong> {walletEthBalance} ETH</p>
      </div>
    </div>
  );
};

export default App;
