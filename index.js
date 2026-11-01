import express from "express";
import 'dotenv/config';
import { MongoClient } from 'mongodb';
const app = express();
  const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ofxhydd.mongodb.net/`);
const PORT= process.env.PORT || 5000;

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB();
app.get('/',(req,res)=>{
  res.send('users are coming soon');

})
app.listen(PORT,()=>{
  console.log(`server is running on PORT ${PORT}`);
})