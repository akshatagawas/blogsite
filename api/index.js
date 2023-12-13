const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

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
    const UserDoc = await User.findOne({username}).maxTimeMS(30000);;
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


app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+"."+ext;
    fs.renameSync(path, newPath);
    // res.json({ext});

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });
    // res.json(postDoc);
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;

    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + "." + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);

        if (!postDoc) {
            return res.status(404).json("Post not found");
        }

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

        if (!isAuthor) {
            return res.status(400).json("You are not the author!");
        }

        // Update only the fields that are provided, and use newPath if available
        const updateFields = {
            title,
            summary,
            content,
            cover: newPath || postDoc.cover,
        };

        await postDoc.updateOne(updateFields);
        // Fetch the updated document if needed
        const updatedPostDoc = await Post.findById(id);

        res.json(updatedPostDoc);
    });
});


app.get('/post', async (req,res) =>{
    const data = await Post.find()
                        .populate('author', ['username'])
                        .sort({createdAt: -1})
                        .limit(20)
    // console.log(data);
    res.json(data);
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.listen(4000);

// 