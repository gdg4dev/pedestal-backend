const mongoose = require('mongoose')
const transactionSchema = new mongoose.Schema({
    secondary: {
        required: true,
        type: String,
        unique: true
    },
    history: {
        type: Array,
        default: []
    }
},  {timestamps: true})

module.exports = mongoose.model('transactions', transactionSchema)