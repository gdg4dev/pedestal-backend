const express = require("express");
const router = express.Router();
const players = require("../db/schema/players");

const playerExists =async (playerId) => {
    const player = await players.findById(playerId);
    return player
}

//create game
router
	.get("/:playerId", async (req, res, next) => {
		const { playerId } = req.params;

		try {
            let player = await playerExists(playerId)
			if (!player) {
				return res.status(404).send({ message: "player not found" });
			}
			res.status(200).json(player);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "player not found -> db error" });
		}
	})
	.post("/privy", async (req,res,send) => {
		if (!req.body) return res.status(400).send({error: "No JSON data provided"})
		if(!req.body.privyId) return res.status(400).send({error: "field privyId is required"})
		try {
			const player = await players.findOne({ privyId: await req.body.privyId }).exec();
			if (player) {
				console.log(player)
			  	res.status(200).send({id: player._id.toString()})
			} else {
				//no user with privy id found
				let createdPlayer = await players.create(req.body);
				console.log("here")
				res.status(200).send({id: createdPlayer._id.toString()})
			}
		  } catch (error) {
			console.error('Error checking if player exists:', error);
			res.status(500).send({error:true, log: error})
		  }
	})
	.post("/", async (req, res, next) => {
		try {
			if (!req.body)
				res.status(400).send({ error: "No JSON data provided" });
            if(!req.body.secondary) {
                req.body.secondary = []
            }
			let createdPlayer = await players.create(req.body);
			console.log("player created successfully");
			res.status(200).send({
				message: "player created successfully",
				details: createdPlayer
			});
		} catch (e) {
			console.log(e);
			res.status(400).send({ error: "Required Fields Missing" });
		}
	})
    .put("/", async (req, res, next) => {
        const { playerId, secondary } = req.body;
        try {
            await players.updateOne(
                { _id: playerId },
                { $push: { secondary } }
            );
            res.status(200).send({message: 'added successfully'});
        } catch (error) {
            console.log(error)
            res.status(500).send({error:'Error adding'});
        }
    })

module.exports = router;
