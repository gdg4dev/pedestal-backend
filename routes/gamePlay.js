const express = require("express");
const router = express.Router();
const contests = require("../db/schema/contests");
const players = require("../db/schema/players");

const playerExists = async (primary) => {
    const player = await players.findOne({primary});
    if (player) return true
    return false
}
const gameExists = async (gameId) => {
    const game = await contests.findById(gameId);
    if (game) return true
    return false
}



//create game
router.put("/join", async (req, res, next) => {
	const { primaryAddr, secondaryAddr, gameId } = req.body;
	// check if player exists

    if (await playerExists(primaryAddr)) {
        if (await gameExists(gameExists)) {
            await contests.findOneAndUpdate({_id: gameId},  { $push: { players: secondaryAddr } },   { new: true }, async (err, updatedGame) => {
                if (err) {
                    console.error('Error adding player to game:', err);
                    return res.status(500).send({
                        message: "Error adding player to the game",
                        logs: err
                    })
                }
                if (updatedGame) {
                    let kvPair ={gameId, secondaryAddr}
                    await players.findOneAndUpdate({primary: primaryAddr},  { $push: { players: kvPair } } ,  { new: true }, async (err, updatedPlayer) => {
                        if (err) {
                            console.error('Error adding game history to player:', err);
                            return res.status(500).send({
                                message: "Error adding game history to player",
                                logs: err
                            })
                        }

                        if (updatedPlayer) {
                            res.status(200).send({message: "success", data: updatedGame})
                        }

                    })
                }
            })
        }
        else {
            res.status(404).send({message: "game not found"})
        }
    } else {
        res.status(404).send({message: "player not found"})
    }

	// check if game exists

	// find game -> add player's disposable address to the players array -> go to player's profile and add to secondary
});

module.exports = router;
