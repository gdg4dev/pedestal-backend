require('dotenv').config()
const express = require("express")
const app = express()
const createGameAPI = require("./routes/createGame")
const PORT = process.env.PORT || 3000
app.use(express.json())

app.use("/v1/createGame", createGameAPI)
// app.use("/v1/manageGame", manageGameAPI)

app.listen(PORT, ()=>console.log("Pedestal Server Running...."))
