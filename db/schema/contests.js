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
    players: {
        required: true,
        type: Array
    },
    isGameActive: {
        type: Boolean,
        default: false
    },
    isGameFinished: {
        type: Boolean,
        default: false
    },
    deposits: {
        type: Array,
        default: [],
    }
},  {timestamps: true})

module.exports = mongoose.model('contests', contestSchema)