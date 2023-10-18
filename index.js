const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b0m9oyj.mongodb.net/?retryWrites=true&w=majority`;

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

    const brands = client.db("carvistaDB").collection("brands");

    const brandsData = [
      {
        brandName: "Toyota",
        img: "https://i.ibb.co/3Nbjh4j/car-1.png",
      },
      {
        brandName: "Ford",
        img: "https://i.ibb.co/vVmcCQz/carf-2.png",
      },
      {
        brandName: "BMW",
        img: "https://i.ibb.co/vxbQzVx/car-3.jpg",
      },
      {
        brandName: "Mercedes-Benz",
        img: "https://i.ibb.co/VtsK7CG/car-4.jpg",
      },
      {
        brandName: "Tesla",
        img: "https://i.ibb.co/fGkxjzT/car-5.jpg",
      },
      {
        brandName: "Honda",
        img: "https://i.ibb.co/vQJ4GvX/car-6.jpg",
      },
    ];

    // Prevent additional documents from being inserted if one fails
    const options = { ordered: true };
    // Execute insert operation
    const result = await brands.insertMany(brandsData, options);
    // Print result
    console.log(`${result.insertedCount} documents were inserted`);

    // Send a ping to confirm a successful connection
    https: await client.db("admin").command({ ping: 1 });
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
  res.send("CarVista is running");
});

app.listen(port, () => {
  console.log(`CarVista is running on port : ${port}`);
});
