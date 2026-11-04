import express from "express";
import cors from 'cors';
import 'dotenv/config';
import { MongoClient,ObjectId } from 'mongodb';
const app = express();
  const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ofxhydd.mongodb.net/`);
const PORT= process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongoClient= await connectToMongoDB();
const db = mongoClient.db("StudioSpace");
const StudiosCollection =db.collection("Studios");
const CategoriesCollection = db.collection('Categories');
const BookingsCollection = db.collection('Bookings');
app.get('/featured-studios',async(req,res)=>{
      const studios = await StudiosCollection
      .find({})
      .sort({ rating: -1 })
      .limit(6)
      .toArray();
      res.send(studios);
})
app.get("/category", async (req, res) => {
  const { category } = req.query;

  const query = category ? { category } : {};

  const studios = await CategoriesCollection.find(query)
    .sort({ rating: -1 })
    .toArray();

  res.send(studios);
});
app.get('/',(req,res)=>{
  res.send('users are coming soon');
})
app.get('/studios/:id',async(req,res)=>{
   const {id}=req.params;
      const result = await StudiosCollection.findOne({_id:new ObjectId(id)});
     res.send(result);
})
app.get('/studios', async (req, res) => {
  const { category } = req.query;

  const query = category ? { category } : {};

  const studios = await StudiosCollection
    .find(query)
    .sort({ rating: -1 })
    .toArray();

  res.send(studios);
});
app.post('/add-studio',async (req,res)=>{
  const data = req.body;
  const result= await StudiosCollection.insertOne(data);

  console.log(result);
  res.send(result);
});
app.get('/my-listings', async (req, res) => {
  const email = req.query.email;

  const result = await StudiosCollection
    .find({ userEmail: email })
    .toArray();

  res.send(result);
});
app.patch('/studios/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await StudiosCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );

  res.send(result);
});
app.post('/bookings', async (req, res) => {
    console.log("Booking API called!");

  const booking = req.body;

  const result = await BookingsCollection.insertOne({
    ...booking,
    status: "Pending",
    createdAt: new Date()
  });

  res.send(result);
});
app.get('/my-bookings', async (req, res) => {
  const email = req.query.email;

  const result = await BookingsCollection
    .find({ userEmail: email })
    .toArray();
  res.send(result);
});
app.patch('/bookings/:id/cancel', async (req, res) => {
  const id = req.params.id;

  const result = await BookingsCollection.updateOne(
    {
      _id: new ObjectId(id),
      status: "Pending"
    },
    {
      $set: {
        status: "Cancelled"
      }
    }
  );

  if (result.modifiedCount === 0) {
    return res.status(400).send({
      message: "Booking cannot be cancelled"
    });
  }

  res.send({
    message: "Booking cancelled successfully"
  });
});
app.listen(PORT,()=>{
  console.log(`server is running on PORT ${PORT}`);
})