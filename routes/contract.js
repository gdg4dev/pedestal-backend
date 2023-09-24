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


router.post('/endGame', async (req, res) => {
  const { gameId, winnerAddress } = req.body;
  const data = contract.methods.endGame(gameId, winnerAddress).encodeABI();
  const tx = {
    to: contractAddress,
    data,
    gas: 2000000,
  };
  try {
    const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
})


module.exports = router;