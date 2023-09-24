const express = require("express");
const router = express.Router();
const transactions = require("../db/schema/transactions");

//create game
router
.get("/all", async (req, res, next) => {
    try {
        let transactions1 = await transactions.find({})
        if (!transactions1) res.status(400).json({message: 'no transactions found globally'})
        console.log(transactions1)
        res.status(200).send({message: "found", data: transactions1})
    } catch (error) {
        console.log(error)
        res.status(500).send({message: "something went wrong with tx", logs: error})
    }
})
.get("/one/", async (req, res, next) => {
    let {secondaryAddr} = req.body
    try {
        let transactions1 = await transactions.findOne({secondary: secondaryAddr})
        if (!transactions1) res.status(400).json({message: 'no transactions found globally'})
        console.log(transactions1)
        res.status(200).send({message: "found", data: transactions1})
    } catch (error) {
        console.log(error)
        res.status(500).send({message: "something went wrong with tx", logs: error})
    }
})


module.exports = router;