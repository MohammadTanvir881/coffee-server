const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.User_DB}:${process.env.User_Pass}@cluster0.xotjp9x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("coffeeDB");
    const coffee = database.collection("coffee");
    const userdb = database.collection("user");

    app.get("/coffee", async (req, res) => {
      const cursor = coffee.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffee.findOne(query);
      res.send(result);
    });

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const newCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateCoffee = {
        $set: {
          name: newCoffee.name,
          quantity: newCoffee.quantity,
          supplier: newCoffee.supplier,
          taste: newCoffee.taste,
          category: newCoffee.category,
          details: newCoffee.details,
          photo: newCoffee.photo,
        },
      };
      const result = await coffee.updateOne(filter, updateCoffee, option);
      res.send(result);
    });

    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffee.insertOne(newCoffee);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffee.deleteOne(query);
      res.send(result);
    });

    // user related information
    app.get("/user", async (req, res) => {
      const cursor = userdb.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userdb.insertOne(user);
      res.send(result);
    });

    app.get('/user/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userdb.findOne(query);
      res.send(result)
    })

    app.patch('/user', async(req,res)=>{
      const newUSer = req.body;
      const filter = {email: newUSer.email};
      const updateDoc = {
         $set: {
          lastLoggedAt : newUSer.lastLoggedAt
         }
      }
      const result = await userdb.updateOne(filter, updateDoc)
      res.send(result)
    })

    app.delete('/user/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userdb.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee server is running successfully");
});

app.listen(port, () => {
  console.log("Coffee server is running from port", port);
});
