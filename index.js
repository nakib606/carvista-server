const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    const productCollection = client.db("carVista").collection("products");

    const addedProductsCollection = client
      .db("carVista")
      .collection("addedproducts");

    // getting product from database
    /*   app.get("/addproduct", async (req, res) => {
      const cursor = productCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    }); */
    app.get("/allproducts", async (req, res) => {
      const cursor = productCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/allproducts/:brandname", async (req, res) => {
      const name = req.params.brandname;
      const query = { brand: name }; // Assuming the field name is 'name' in your collection
      const products = await productCollection.find(query).toArray();
      res.send(products);
    });

    app.get("/details", async (req, res) => {
      const cursor = addedProductsCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    });

    // getting single data from database
    app.get("/addproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });
    // getting single data from database
    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    app.put("/updated/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const options = { upsert: true };
      const filter = { _id: new ObjectId(id) };
      const updatedProduct = {
        $set: {
          img: product.img,
          name: product.name,
          brand: product.brand,
          type: product.type,
          price: product.price,
          description: product.description,
          rating: product.rating,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedProduct,
        options
      );
      res.send(result);
    });

    // getting single data from database
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    // delete from database
    app.delete("/addproduct/:id", async (req, res) => {
      const id = req.params.id;
      console.log("please delete from database", id);
      const query = { _id: new ObjectId(id) };
      const result = await addedProductsCollection.deleteOne(query);
      res.send(result);
    });

    // sending added products to database
    app.post("/addproduct", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    // sending added products to database
    app.post("/details", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await addedProductsCollection.insertOne(product);
      res.send(result);
    });

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
