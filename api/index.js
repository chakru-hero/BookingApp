const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('./models/User');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const Place = require('./models/place');
const Booking = require('./models/Booking');
const { resolve } = require('path');
const { rejects } = require('assert');


require('dotenv').config();
const app = express();
const secret = bcrypt.genSaltSync(10);
const jwtSecret = 'secret';
const _dest = '/uploads/places/';
app.use(express.json());
app.use(cookieparser());
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}))

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromRequest(req){
    return new Promise((resolve,reject)=>{
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, user) => {
            if(err) throw err;
            resolve(user);
        });
    });
}

app.get('/ping', (req, res) => {
    res.json('pong');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await UserModel.create({
            name,
            email,
            password: bcrypt.hashSync(password, secret),
        });
        res.json(user);

    }
    catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const passOK = bcrypt.compareSync(password, user.password);
            if (passOK) {
                jwt.sign({
                    email: user.email,
                    id: user._id,
                    // name:user.name
                }, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(user);
                });
            }
            else {
                res.status(422).json('pass not ok');
            }
        }
        else {
            res.status(404).json('not found');
        }
    }
    catch (e) {

    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) throw err;
            const { name, email, _id } = await UserModel.findById(user.id)
            res.json({ name, email, _id });
        });
    }
    else {
        res.json(null);

    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/uploadByLink', async (req, res) => {
    const link = req.body.Link;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + _dest + newName,
    });

    res.json(newName);

});


const photosMiddleware = multer({ dest: 'uploads/places/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(getFilename(newPath));
    }
    res.json(uploadedFiles);
})


function getFilename(fullPath) {
    return fullPath.replace(/^.*[\\\/]/, '');
}

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos,
        description, perks, extraInfo, checkIn,
        checkOut, maxGuests,price } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: user.id,
            title, address, photos : addedPhotos,
            description, perks, extraInfo, checkIn,
            checkOut, maxGuests,price
        });
        res.json(placeDoc);
    });
});

app.get('/user-places', (req,res)=>{
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const {id} = user;
        res.json(await Place.find({owner:id}));
    });

});

app.get('/places/:id', async (req,res)=>{
    const {id} = req.params;
    res.json(await Place.findById(id));
});

app.put('/places', async(req,res)=>{

    const { token } = req.cookies;
    const { id,title, address, addedPhotos,
        description, perks, extraInfo, checkIn,
        checkOut, maxGuests,price } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const placeDoc = await Place.findById(id);
        if(user.id === placeDoc.owner.toString()){
            placeDoc.set({
                title, address, photos : addedPhotos,
            description, perks, extraInfo, checkIn,
            checkOut, maxGuests,price
            });
           await placeDoc.save();
            res.json('ok');
        }
    });    
});

app.get('/places', async (req,res)=>{
 res.json(await Place.find());
});

app.post('/booking', async (req,res)=>{
    const userData = await getUserDataFromRequest(req);
    const {place,name,checkIn,checkOut,numberOfGuests,mobile,price} 
    = req.body;
     Booking.create({
        place,name,checkIn,checkOut,numberOfGuests,mobile,price,user:userData.id,
    }).then((document)=>{
        res.json(document);
    }).catch((err)=>{
        throw err;
    });

});



app.get('/bookings', async (req,res)=>{
   const userData = await getUserDataFromRequest(req);
   res.json( await Booking.find({user:userData.id}).populate('place'));
});

app.listen(4000);
