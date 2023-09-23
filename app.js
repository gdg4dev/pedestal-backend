require('dotenv').config()
const express = require("express")
const app = express()
const createGameAPI = require("./routes/createGame")
const manageGameAPI = require("./routes/manageGame")
const playerAPI = require("./routes/player")

const PORT = process.env.PORT || 3000
const cors = require('cors')
app.use(cors())
app.options('*', cors())
app.post('*', cors())
app.get('*', cors())
app.put('*', cors())
app.delete('*', cors())
app.patch('*', cors())

app.use(express.json())
require('./db/config')

app.use("/v1/createGame", createGameAPI)
app.use("/v1/manageGame", manageGameAPI)
app.use("/v1/player", playerAPI)


app.listen(PORT, ()=>console.log("Pedestal Server Running...."))