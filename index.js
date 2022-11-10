const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Photography-World server side is running......')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})