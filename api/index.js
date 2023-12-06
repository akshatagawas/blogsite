const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

const salt = bcrypt.genSaltSync(10);
const secret = 'eghwgf7832uelwi';
// Wu7HXlc9SJMonOzI

mongoose.connect('mongodb+srv://agawas:Wu7HXlc9SJMonOzI@cluster0.ybb7bgt.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try{
        const UserDoc = await User.create({
            username,
            password:bcrypt.hashSync(password, salt),
        })
        res.json(UserDoc);
    } catch(e){
        res.status(400).json(e)
    }
    
    
});



app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const UserDoc = await User.findOne({username});
    // console.log(UserDoc)
    const passOk = bcrypt.compareSync(password, UserDoc.password);
    // res.json(passOk);
    if (passOk){
        jwt.sign({username, id:UserDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:UserDoc._id,
                username,
            });
            // res.json(token);
        });
    }else{
        res.status(400).json('The username or password does not match!')
    }
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});


app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
} );


app.listen(4000);

// 