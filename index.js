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
        const reviewCollection = client.db('phWorld').collection('reviews')
        //# service api
        app.get('/services', async (req, res) => {
            const query = {}
            const options = {
                // sort returned documents in ascending order by title (A->Z)
                sort: { createdAT: -1 },
            };
            const cursor = serviceCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/services-by-id', async (req, res) => {
            const query = { _id: ObjectId(req.query.id) };
            const options = {
                // sort returned documents in ascending order by title (A->Z)
                sort: { createdAT: -1 },
            };
            const cursor = serviceCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleService = await serviceCollection.findOne(query);
            res.send(singleService)
        })
        app.post('/add-service', async (req, res) => {
            const service = req.body
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })

        //# review api 
        app.post('/add-review', async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const query = { serviceId: req.query.id };
            const options = {
                // sort returned documents in ascending order by title (A->Z)
                sort: { createdAT: -1 },
            };
            const cursor = reviewCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.delete('/review-delete/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

        //# user-api 
        app.get('/user-review', async (req, res) => {
            const query = { userId: req.query.id };
            const options = {
                // sort returned documents in ascending order by title (A->Z)
                sort: { createdAT: -1 },
            };
            const cursor = reviewCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result)
        })



    } catch (error) {

    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})