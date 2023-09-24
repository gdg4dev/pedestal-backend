require('dotenv').config()
var cron = require("node-cron");
var Alchemy = require("alchemy-sdk").Alchemy;
var Network = require("alchemy-sdk").Network;
const contests = require("../db/schema/contests");
const players = require("../db/schema/players");
const transactions = require("../db/schema/transactions")
require('../db/config')

const settings = {
	apiKey: process.env.AlchemyAPI, // Replace with your Alchemy API key.
	network: Network.ETH_GOERLI, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const getTransactionHistory = async (address) => {
	let data = await alchemy.core.getAssetTransfers({
		fromAddress: address,
		category: ["external", "internal", "erc20"],
	});
	return data;
};

let demoData = {
	transfers: [
		{
			blockNum: "0x94c050",
			uniqueId:
				"0xd0494d3675c1eb2c0f10e82ef3b2da92aca68e09bdb6dbca3aa6f973966b21d4:external",
			hash: "0xd0494d3675c1eb2c0f10e82ef3b2da92aca68e09bdb6dbca3aa6f973966b21d4",
			from: "0x721426be7235e50ff80209d91d93e3350e36e2dc",
			to: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
			value: 0.01,
			erc721TokenId: null,
			erc1155Metadata: null,
			tokenId: null,
			asset: "ETH",
			category: "external",
			rawContract: [Object],
		},
		{
			blockNum: "0x94c056",
			uniqueId:
				"0xe3e9d74e3f2198d184213dec283f82b48ce0d5379aaabcd5a0318efa458cd1a7:external",
			hash: "0xe3e9d74e3f2198d184213dec283f82b48ce0d5379aaabcd5a0318efa458cd1a7",
			from: "0x721426be7235e50ff80209d91d93e3350e36e2dc",
			to: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
			value: 0.02,
			erc721TokenId: null,
			erc1155Metadata: null,
			tokenId: null,
			asset: "ETH",
			category: "external",
			rawContract: [Object],
		},
		{
			blockNum: "0x94c10b",
			uniqueId:
				"0xf0350457859e53bd92a28e2b11f19ed5ca0f016792657ae2e44e84cb6358ee38:external",
			hash: "0xf0350457859e53bd92a28e2b11f19ed5ca0f016792657ae2e44e84cb6358ee38",
			from: "0x721426be7235e50ff80209d91d93e3350e36e2dc",
			to: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
			value: 0.01,
			erc721TokenId: null,
			erc1155Metadata: null,
			tokenId: null,
			asset: "ETH",
			category: "external",
			rawContract: [Object],
		},
		{
			blockNum: "0x94c2db",
			uniqueId:
				"0xf0c78edf68af1e7fd661edbee1925e23799b9e78e27c80a6085b1c001965c1f7:external",
			hash: "0xf0c78edf68af1e7fd661edbee1925e23799b9e78e27c80a6085b1c001965c1f7",
			from: "0x721426be7235e50ff80209d91d93e3350e36e2dc",
			to: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
			value: 0.03,
			erc721TokenId: null,
			erc1155Metadata: null,
			tokenId: null,
			asset: "ETH",
			category: "external",
			rawContract: [Object],
		},
	],
};

const getBatchTransactionHistory = async (addrArr) => {
  const historyArray = await Promise.all(addrArr.map(async (v) => {
    const history = await getTransactionHistory(v);
    return {address: v, history};
  }));
  return historyArray;
};

const findActiveGames = async () => {
  let addresses = []
	let games = await contests.find({ isGameActive: true });
   games.forEach(async (game, i) => {
    addresses = addresses.length != 0? [...addresses, ...game.players] : [...game.players]
  })
  addresses = [...new Set(addresses)]
  return addresses
};

var task = cron.schedule(" */10 * * * * *", async () => {
  const array1 = await findActiveGames();
  const data = await getBatchTransactionHistory(array1)
  await Promise.all(data.map(async (v) => {
    // await transactions.create({secondary:v.address, history: v.history});
    const query = { secondary: await v.address }; // Replace with your query
    const update = { secondary: await v.address, history: await  v.history.transfers }; // Replace with your update
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    await transactions.findOneAndUpdate(query, update, options)
  }));
  console.log("cron job executed at: " + (new Date).toISOString())
});

task.start();
