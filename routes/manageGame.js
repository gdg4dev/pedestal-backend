const express = require("express");
const router = express.Router();
const contests = require("../db/schema/contests");

//create game
router
.get("/:gameId", async (req, res, next) => {
    const { gameId } = req.params;

    try {
        const game = await contests.findById(gameId);
        if (!game) {
            return res.status(404).send({message: 'game not found'});
        }
        res.status(200).json(game);
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'game not found -> db error'});
    }
})
.put("/player", async (req, res, next) => {
    const { gameId, playerAddress } = req.body;
    try {
        await contests.updateOne(
            { _id: gameId },
            { $push: { players: playerAddress } }
        );
        res.status(200).send({message: 'Player added successfully'});
    } catch (error) {
        console.log(error)
        res.status(500).send({error:'Error adding player'});
    }
})
.delete("/player", async (req, res, next) => {
    const { gameId, playerAddress } = req.body;
    try {
        await contests.updateOne(
            { _id: gameId },
            { $pull: { players: playerAddress } }
        );
        res.status(200).send({ message: 'Player removed successfully'});
    } catch (error) {
        res.status(500).send({error:'Error removing player'});
    }
})

module.exports = router;