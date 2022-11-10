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
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ message: 'unauthorized' })

    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) return res.status(403).send({ message: 'Forbidden access' })
        req.decoded = decoded
        next()
    });

}


async function run() {
    try {
        const serviceCollection = client.db('phWorld').collection('services')
        const reviewCollection = client.db('phWorld').collection('reviews')


        //# JWT-TOKEN
        app.post('/jwt', (req, res) => {
            const user = req.body
            console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ token })
        })


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

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleService = await serviceCollection.findOne(query);
            res.send(singleService)
        })
        app.post('/add-service', verifyJWT, async (req, res) => {
            const service = req.body
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })

        //# review api 
        app.post('/add-review', verifyJWT, async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

        app.get('/reviews', verifyJWT, async (req, res) => {
            const query = { serviceId: req.query.id };
            const options = {
                // sort returned documents in ascending order by title (A->Z)
                sort: { createdAT: -1 },
            };
            const cursor = reviewCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.patch('/review-update/:id', verifyJWT, async (req, res) => {
            const id = req.params.id
            const rate = req.body.rate
            const review = req.body.review
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    rate: rate,
                    review: review
                },
            };

            const result = await reviewCollection.updateOne(query, updateDoc);
            res.send(result)
        })

        app.delete('/review-delete/:id', verifyJWT, async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

        //# user-api 
        app.get('/user-review', verifyJWT, async (req, res) => {

            const decoded = req.decoded
            console.log(decoded);
            if (decoded.userId !== req.query.id) return res.status(403).send({ message: 'unauthorized access' })
            let query = {}
            if (req.query.id) {
                query = { userId: req.query.id };
            }

            const options = {
                // sort returned documents in ascending order by title (A->Z)
                sort: { createdAT: -1 },
            };

            const cursor = reviewCollection.find(query, options);
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

    } catch (error) {

    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})