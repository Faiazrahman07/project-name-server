import express from "express";
const app = express();
  
const PORT= process.env.PORT || 5000;

app.get('/',(req,res)=>{
  res.send('users are coming soon');

})
app.listen(PORT,()=>{
  console.log(`server is running on PORT ${PORT}`);
})