import express from 'express';
import { chats } from './data/data.js';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import {
  notFound,
  errorHandler
} from './middleware/errorMiddleware.js';
import messageRoutes from './routes/messageRoutes.js';
import { Server } from 'socket.io';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';// config
const app = express();
dotenv.config();
connectDb();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// // Serve static files from the frontend build directory
// app.use(express.static(join(__dirname, '..', 'client', 'build')));

// // Handle API routes or other backend logic here
// // ...

// // For any other route, serve the frontend's index.html file
// app.get('*', (req, res) => {
//   res.sendFile(join(__dirname, '..', 'client', 'build', 'index.html'));
// });
  app.use(notFound)
  app.use(errorHandler)


  const server =app.listen(process.env.PORT, ()=>{
    console.log("Listening on port " + process.env.PORT);
  })

  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "https://chat-talk.onrender.com"
    },
  });
  io.on("connection", (socket) =>{
    console.log("connected to socket.io");
    socket.on('setup', (userData) =>{
      socket.join(userData._id);
      socket.emit('connected');
    })
    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log("User joined the room" + room)
    })
    socket.on('typing',(room) => socket.in(room).emit('typing')); 
    socket.on('stop typing',(room) => socket.in(room).emit('stop typing')); 

    socket.on('new message', (newMessageReceived)=>{
      var chat= newMessageReceived.chat

      if(!chat.users)return console.log("Chat.users not defined");

      chat.users.forEach(user=>{
        if(user._id == newMessageReceived.sender._id)return;
        socket.in(user._id).emit("message received",newMessageReceived);
      })
      
    })
    socket.off("setup", ()=>{
      console.log("User disconnected");
      socket.leave(userData._id);
    })
  })