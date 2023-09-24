const fs = require("fs")
const path = require("path")
const contractABI = fs.readFileSync(path.join(__dirname, '../utils/abi.json'), {encoding: "utf-8"})
const alchemyEndpoint = `https://eth-goerli.g.alchemy.com/v2/${process.env.AlchemyAPI}`
const contractAddress = "0x1353466B356674ce3334bFAeeDF63f31BBc662D3"
const Web3 = require('web3');
const express = require("express");
const router = express.Router();
const contests = require("../db/schema/contests");
const players = require("../db/schema/players");

const web3 = new Web3(alchemyEndpoint); // Replace with your Infura project ID or your Ethereum node URL



const contract = new web3.eth.Contract(contractABI, contractAddress);
// const functionName = 'closeGame'; // Replace with the function name you want to call
// const functionArguments = [arg1, arg2]; 

const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const options = {
    from: '0xYourWalletAddress', // Replace with your Ethereum wallet address
    gasPrice: web3.utils.toWei('100', 'gwei'), // Customize gas price if needed
    value: web3.utils.toWei('0.1', 'ether'), // Value to send if it's a payable function
  };

contractABI

console.log(abi)


module.exports = router;


// TO DO s
// 1. closeGame Function
