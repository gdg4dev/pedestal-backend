const express = require("express");
const router = express.Router();
// const contests = require("../db/schema/contest");
const contests = require("../db/schema/contests");

//create game
router.post("/", async (req, res, next) => {
	if (!req.body) res.status(400).send({ error: "No JSON data provided" });
	try {
		let { gameName, maxPlayers, duration, stakeAmount, balanceToStart } =
			req.body;
        // initialized 
        req.body.players = [];
        await contests.create(req.body);
		console.log("User created successfully");
		res.status(200).send({
			message: "game created successfully"
		});
	} catch (e) {
		console.log(e);
		res.status(400).send({ error: "Required Fields Missing"});
	}
});

module.exports = router;
