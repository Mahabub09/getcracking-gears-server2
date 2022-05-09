const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ll629.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('getCrackingGears').collection('items')

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item)
        })

        // item post
        app.post('/item', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        })
        app.get('/myItems', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        //  Delete item
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })
        app.put("/item/:id", async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedNumber = {
                $set: {
                    quantity: updatedQuantity.quantity,
                },
            };
            const result = await itemCollection.updateOne(
                filter,
                updatedNumber,
                options
            );
            res.send(result);
        });

    }
    finally {

    }
}

run();
app.get("/", (req, res) => {
    res.send("Running my GetCracking server");

});
app.get("/hero", (req, res) => {
    res.send('heroku problem solving')
})

app.listen(port, () => {
    console.log("Get Cracking is running", port);
});