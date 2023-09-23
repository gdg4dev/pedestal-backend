const mongoose = require('mongoose')
const contestSchema = new mongoose.Schema({
    gameName: {
        required: true,
        type: String
    },
    maxPlayers: {
        required: true,
        type: Number
    },
    duration: {
        required: true,
        type: Number,
    },
    stakeAmount: {
        required: true,
        type: Number,
    },
    balanceToStart: {
        required: true,
        type: Number
    },
    playerAddress: {
        type: String
    }
})

module.exports = mongoose.model('contests', contestSchema)