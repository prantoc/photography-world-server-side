const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Photography-World server side is running......')
})


//!database connection details

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7incky7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const serviceCollection = client.db('phWorld').collection('services')

        //service api
        app.post('/add-service', async (req, res) => {
            const service = req.body
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })

    } catch (error) {

    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})