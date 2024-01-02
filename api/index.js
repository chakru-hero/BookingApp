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


require('dotenv').config();
const app = express();
const secret = bcrypt.genSaltSync(10);
const jwtSecret = 'secret';
const _dest = '/uploads/places/';
app.use(express.json());
app.use(cookieparser());
app.use('/uploads', express.static(__dirname+'/uploads'))
app.use(cors({
    credentials:true,
    origin : 'http://localhost:5173',
}))

mongoose.connect(process.env.MONGO_URL);

app.get('/ping',(req,res)=>{
    res.json('pong');
});

app.post('/register', async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        const user = await UserModel.create({
            name,
            email,
            password:bcrypt.hashSync(password,secret),
        });
        res.json(user);

    }
    catch(e){
        res.status(422).json(e);
    }
});

app.post('/login', async(req,res)=>{
    const {email,password} = req.body;
    try{
       const user =  await UserModel.findOne({email});
       if(user){
        const passOK = bcrypt.compareSync(password,user.password);
        if(passOK){
            jwt.sign({email:user.email,
                id:user._id,
                // name:user.name
            },jwtSecret,{},(err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json(user);
            });
        }
        else{
            res.status(422).json('pass not ok');
        }
       }
       else{
        res.status(404).json('not found');
       }
    }
    catch(e){
        
    }
});

app.get('/profile', (req,res)=>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {},async (err,user)=>{
            if(err) throw err;
            const {name,email,_id} = await UserModel.findById(user.id)
            res.json({name,email,_id});
        });
    }
    else{
        res.json(null);

    }
})

app.post('/logout', (req,res) =>{
    res.cookie('token','').json(true);
});

app.post('/uploadByLink', async (req,res)=>{
    const link = req.body.Link;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url:link,
        dest: __dirname + _dest + newName,
    });

    res.json(newName);

});


const photosMiddleware = multer({dest:'uploads/places/'});
app.post('/upload', photosMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles = [];
    for(let i=0;i<req.files.length;i++){
        const {path,originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length -1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(getFilename(newPath));
    }
    res.json(uploadedFiles);
})

function getFilename(fullPath) {
    return fullPath.replace(/^.*[\\\/]/, '');
  }

app.listen(4000);
