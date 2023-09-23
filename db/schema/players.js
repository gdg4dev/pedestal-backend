const mongoose = require('mongoose')
const playerSchema = new mongoose.Schema({
    primary: {
        required: true,
        type: String
    },
    secondary: {
        required: true,
        type: Array,
        default: []
    },
    privyId: {
        type: String
    }
},  {timestamps: true})

module.exports = mongoose.model('players', playerSchema)