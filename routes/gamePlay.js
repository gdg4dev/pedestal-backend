const express = require("express");
const router = express.Router();
const contests = require("../db/schema/contests");
const players = require("../db/schema/players");

const playerExists = async (primary) => {
	const player = await players.findOne({ primary });
	if (player) return true;
	return false;
};
const gameExists = async (gameId) => {
	const game = await contests.findById(gameId);
	if (game) return true;
	return false;
};

//create game
router
	.put("/join", async (req, res, next) => {
		const { primaryAddr, secondaryAddr, gameId } = req.body;
		// check if player exists
		try {
			if (await playerExists(primaryAddr)) {
				if (await gameExists(gameId)) {
					let updatedGame = await contests.findOneAndUpdate(
						{ _id: gameId },
						{ $push: { players: secondaryAddr } },
						{ new: true }
					);
					if (!updatedGame)
						return res
							.status(404)
							.send({ message: "game not found" });
					let kvPair = { gameId, secondaryAddr };
					let updatedPlayer = await players.findOneAndUpdate(
						{ primary: primaryAddr },
						{ $push: { gameHisory: kvPair } },
						{ new: true }
					);
					if (!updatedPlayer)
						return res
							.status(404)
							.send({ message: "player not found" });
					return res
						.status(200)
						.send({ message: "success", data: updatedGame });
				} else {
					return res.status(404).send({ message: "game not found" });
				}
			} else {
				return res.status(404).send({ message: "player not found" });
			}
		} catch (e) {
			console.log(e);
			return res.status(500).send({ message: "server error", log: e });
		}
	})

	.get("/deposits", async (req, res, next) => {
        const { primaryAddr, secondaryAddr, gameId } = req.body;
       try {
        if (await playerExists(primaryAddr)) {
            if (await gameExists(gameId)) {
                let updatedGame = await contests.findOneAndUpdate(
                    { _id: gameId },
                    { $push: { desposits: secondaryAddr } },
                    { new: true }
                );
                if (updatedGame) {
                    return res.status(200).json({
                        message: "added the player to deposit list",
                        data: updatedGame
                    })
                }
            } else {
                return res.status(404).send({ message: "game not found" });
            }
        } else {
            return res.status(404).send({ message: "player not found" });
        }
       } catch (e) {
             console.log(e);
			return res.status(500).send({ message: "server error", log: e });
       }
		// const {gameId}
	})
	.put("/deposits", async (req, res, next) => {
        const { primaryAddr, secondaryAddr, gameId } = req.body;
        if (await playerExists(primaryAddr)) {
            if (await gameExists(gameId)) {
                
            } else {
                return res.status(404).send({ message: "game not found" });
            }
        } else {
            return res.status(404).send({ message: "player not found" });
        }
    });

module.exports = router;
