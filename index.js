const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// console.log(express)
// middleWare
app.use(express.json());
app.use(cors());

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    const gymCollections = client.db("gymDB").collection("schedule");

    app.post("/schedule", async (req, res) => {
      const data = req.body;
      const result = await gymCollections.insertOne(data);
      res.send(result);
    });

    app.get("/schedule", async (req, res) => {
      const { search } = req.query;
      let option = {};
      if (search) {
        option = { title: { $regex: search, $options: "i" } };
      }
      const cursor = gymCollections.find(option);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/", (req, res) => {
      res.send("fit-server running on");
    });

    app.patch("/schedule", async (req, res) => {
      const info = req.body;

      const filter = { _id: new ObjectId(info.id) };
      const updatedDoc = { $set: {} };
      if (info.isComplete !== undefined) {
        updatedDoc.$set.isComplete = info.isComplete;
      }
      if (info.title !== undefined) {
        updatedDoc.$set.title = info.title;
      }
      const result = await gymCollections.updateOne(filter, updatedDoc);

      res.send(result);
    });

    app.delete("/schedule/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gymCollections.deleteOne(query);
      res.send(result);
      // console.log(id);
    });

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
  }
};

app.listen(port, () => {
  console.log(`fit-server Successfully running on port: ${port}`);
});
run().catch(console.dir);
