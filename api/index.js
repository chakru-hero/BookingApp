const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('./models/User');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const app = express();
const secret = bcrypt.genSaltSync(10);
const jwtSecret = 'secret';
app.use(express.json());
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
            jwt.sign({email:user.email,id:user._id},jwtSecret,{},(err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json('pass OK');
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

app.listen(4000);