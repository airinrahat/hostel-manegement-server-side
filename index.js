const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//hostelUser
//t6lxgFbsEuTKl4Yu

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dbdkno8.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.dbdkno8.mongodb.net/?retryWrites=true&w=majority";

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
    // await client.connect();

    const mealsCollection = client.db("hosteldb").collection("meals");
    const reviewsCollection = client.db("hosteldb").collection("reviews");
    const pricingCollection = client.db("hosteldb").collection("pricing");
    const addMealCollection = client.db("hosteldb").collection("addMeal");
    const requestMealCollection = client.db("hosteldb").collection("request");
    const userCollection = client.db("hosteldb").collection("user");
    const upcomingCollection = client.db("hosteldb").collection("upcoming");

    //meals collection
    app.get("/meals", async (req, res) => {
      const result = await mealsCollection.find().toArray();
      res.send(result);
    });

    //meals collection id
    app.get("/meals/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await mealsCollection.findOne(query);
      res.send(result);
    });
    //reviews collection

    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewsCollection.findOne(query);
      res.send(result);
    });

    //pricing id base

    app.get("/membarship", async (req, res) => {
      const result = await pricingCollection.find().toArray();
      res.send(result);
    });

    app.get("/membarship/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await pricingCollection.findOne(query);
      res.send(result);
    });

    //request meals post
    app.post("/request", async (req, res) => {
      const requestMeal = req.body;
      const result = await requestMealCollection.insertOne(requestMeal);
      res.send(result);
    });

    //request meal e email diye get
    app.get("/request", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await requestMealCollection.find(query).toArray();
      res.send(result);
    });

    //request meal delete
    app.delete("/request/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await requestMealCollection.deleteOne(query);
      res.send(result);
    });

    //request data get sort
    app.get("/requestedallmeals", async (req, res) => {
      const result = await requestMealCollection.find().toArray();
      res.send(result);
    });

    //admin dashboard
    //added meals
    app.post("/meals", async (req, res) => {
      const newAddMeal = req.body;
      const result = await addMealCollection.insertOne(newAddMeal);
      res.send(result);
    });

    app.post("/upcomingmeals", async (req, res) => {
      const newUpcomingMeal = req.body;
      const result = await upcomingCollection.insertOne(newUpcomingMeal);
      res.send(result);
    });

    //transtack query get data

    app.get("/addmeals", async (req, res) => {
      const cursor = addMealCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/meal", async (req, res) => {
      const result = await mealsCollection.find().toArray();
      res.send(result);
    });

    //meal get id
    app.get("/meal/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await mealsCollection.findOne(query);
      res.send(result);
    });
    //meal updated
    app.put("/meal/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const item = req.body;

      const updatedDoc = {
        $set: {
          name: item.name,
          email: item.email,
          title: item.title,
          photo: item.photo,
          like: item.like,
          review: item.review,
        },
      };
      const result = await mealsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //my meal data deleted
    app.delete("/meal/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await mealsCollection.deleteOne(query);
      res.send(result);
    });

    // user related api

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exits", insertedId: null });
      }
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

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
  res.send(" hostel is opening");
});

app.listen(port, () => {
  console.log(`hostel is sitting on port ${port}`);
});
