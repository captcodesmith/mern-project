import express from 'express'; //Express is a web application framework to create a server
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan'; //node and express middleware to logs HTTP requests, errors and more
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';

/* Configurations */
const __filename = fileURLToPath(import.meta.url); // location of the index.js file
const __dirname = path.dirname(__filename); // location of the folder containing index.js
dotenv.config(); //loads environment variables from a .env file into process.env
const app = express(); //creating a new express application
app.use(express.json()); // to parse the json object in the payload
app.use(helmet()); // to protect website from some common securty threats
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); // security
app.use(morgan('common')); //logs
app.use(bodyParser.json({ limit: '30mb', extended: true })); //used for payload passing
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true })); //used for payload passing
app.use(cors()); //allows us to relax the security applied to an API.
app.use('/assets', express.static(path.join(__dirname, 'public/assets'))); // for static folder like pics and all

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // if anyone uploads a file(pic) it will be saved at this location
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }); //save the pic, or upload the file

/*
 * ROUTES WITH FILES
 * this will upload picture to 'public/assets' dir
 * upload.single('picture') is a middleware which stores a single file (picture) into the dir
 * register, createPost are controller callback functions
 */
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

/* ROUTES with `/auth` will be POINTING TO authRoutes*/
app.use('/auth', authRoutes);
/* ROUTES with '/users' will be pointing to userRoutes */
app.use('/users', userRoutes);
/* ROUTES with '/posts' will be pointing to postRoutes */
app.use('/posts', postRoutes);

/* connecting to the mongo atlas server using mongoose */
const PORT = process.env.PORT || 6001;
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((value) => {
    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
