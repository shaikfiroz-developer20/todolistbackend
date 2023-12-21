import express from 'express';
import http from 'http';
import { server as WebSocketServer } from 'websocket';
import corsMiddleware from './middleware/middlewares.js';
import route from './routes/signuproute.js';
import loginRoute from './routes/loginroute.js';
import todolistRouter from './routes/todolist.js';
import updateTodoListRoute from './routes/updatetodolistroute.js';
import getTaskRoute from './routes/gettasks.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session from 'express-session'; 
import User from './models/usermodel.js';
import multer from 'multer';
import todofilterdateroute from './routes/filteredtodoroute.js';
import dotenv from "dotenv"
const app = express();

const mongos=process.env.mongosstringdata;
app.use(corsMiddleware);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'Secret of firoz shaiks application todo list',
    resave: false,
    saveUninitialized: true,
    cookie: { path:'/' }
   
}));


/*app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  console.log('Response Headers:', res.getHeaders());
  next();
});*/

const server = http.createServer(app);
const port = process.env.portnum;

mongoose
  .connect(`${mongos}`)
  .then(() => {
    console.log('connected to mongodb atlas');
  })
  .catch((e) => {
    console.log(e);
  })
  .finally(console.log('connected'));


app.use(express.json());
app.use(bodyParser.json());




app.post('/signup', corsMiddleware, route);
app.post('/login', loginRoute);
app.post('/todolist', corsMiddleware, todolistRouter);
app.put('/updatetodolistroute', updateTodoListRoute);
app.get('/tasks', corsMiddleware, getTaskRoute);
app.delete('/deletetask', updateTodoListRoute);
app.get('/gethistoryofdatestasksadded', corsMiddleware, todolistRouter);
app.get("/filteredtasksondate",corsMiddleware,todofilterdateroute)




app.get("/amilogedin",corsMiddleware,(req,res)=>{
  if (req.session && req.session.userId) {
    res.status(200).json("u are authenticated")
  }
  else{
    res.status(401).json("u are not authenticated")
  }
})



app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      res.status(200).send('Logged out successfully');
    }
  });
});



app.post('/updateprofile', corsMiddleware, upload.single('profileImage'), async (req, res) => {
  if (req.session && req.session.userId) {
    try {
      const { name, phoneNumber } = req.body;
      const userId = req.session.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if a file was uploaded
      if (req.file) {
        // The binary data of the image is available in req.file.buffer
        const profileImageBuffer = req.file.buffer;

        // Save the binary buffer to the user's profilePic field
        user.profilePic = profileImageBuffer;
      }

      // Update user details
      user.name = name;
      user.phoneNumber = phoneNumber;

      // Save the updated user
      await user.save();

      // Send the binary image data in the response
      res.status(200).send(user.profilePic);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});


app.get("/getuserdetails",corsMiddleware,async(req,res)=>{
  if (req.session && req.session.userId) {
    const userId = req.session.userId;

    try {
      const user = await User.findById(userId);

      if (user) {
        const userdata={username:user.name,email:user.email,mobilenum:user.phoneNumber,userPic:user.profilePic}
        res.status(200).json(userdata);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error retrieving user profile data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
})



app.get("/userpic", corsMiddleware, async (req, res) => {
  if (req.session && req.session.userId) {
    const userId = req.session.userId;

    try {
      const user = await User.findById(userId);

      if (user) {
        res.status(200).send(user.profilePic);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error retrieving user profile picture:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false, // You can configure this as needed
});

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log(`Received: ${message.utf8Data}`);
    }
  });

  connection.on('close', (reasonCode, description) => {
    console.log(`Client has disconnected: ${reasonCode}, ${description}`);
  });
});
