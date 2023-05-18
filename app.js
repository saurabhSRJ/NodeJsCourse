const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const fcmRoutes = require('./routes/fcm');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
//static file serving
app.use('/images', express.static(path.join(__dirname, 'images')));
//avoid cors error
app.use(cors());

//routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/fcm', fcmRoutes);

//error handling
app.use((err, req, res, next) => {
    console.log('Main error handling: ' + err);
    const statusCode = err.statusCode || 500;
    const message = err.message;
    const errorData = err.data;
    res.status(statusCode).json({ message: message, data: errorData });
});

mongoose
    .connect('mongodb+srv://mrwhite97:user123@cluster0.wtscz97.mongodb.net/posts?retryWrites=true&w=majority')
    .then(result => {
        console.log('DB connection success!')
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    })


