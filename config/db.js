import mongoose from 'mongoose';

const connectDb = async() =>{
  try{
    const conn = await mongoose.connect("mongodb+srv://josh:test123@chat-app.q1ydyq4.mongodb.net/chat?retryWrites=true&w=majority")
    console.log("Connected to DB");
  }catch(err){
    console.log(err);
  }
}

export default connectDb;