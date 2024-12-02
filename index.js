const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// console.log(express)
// middleWare
app.use(express.json());
app.use(cors());

const uri = "mongodb://localhost:27017"

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

const run = async ()=>{
    try{

        const gymCollections = client.db("gymDB").collection("schedule");
        

        app.post("/schedule",async (req,res)=>{
            const data = req.body;
            const result = await gymCollections.insertOne(data)
            res.send(result);
        })







        app.get("/", (req, res) =>{
            res.send("fit-server running on")
            
        })

        await client.connect();
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!")
    }catch(error){
        console.log(error)
    }
};

app.listen(port, ()=>{
    console.log(`fit-server Successfully running on port: ${port}` )
})
run().catch(console.dir)