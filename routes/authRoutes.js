const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./../db/models/user-modal');
const passwordConfirmation = require('../middleware/passwordConfirmation');
require('dotenv/config')

router.post('/login',(req,res)=>{
    const {email, password} = req.body;
    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).send();// Invalid credentials
        }

        bcrypt.compare(password, user.password).then((match) => {
            console.log("here", match)
            if (!match) {
                return res.status(401).send() // wrong password
            }
            const token = jwt.sign({ _id: user._id }, process.env.secret);
            return res.status(201).header('x-auth', token).send({name: user.name});
        })
    }).catch(err => {
        if (err) return res.status(401).send(err);
        return res.status(401).send();
    })
})

router.post('/register', passwordConfirmation,(req,res)=>{
    console.log("here is me")
    const {name, mobile, email, password} = req.body;
    let newUser = new User({
        name,
        mobile,
        email,
        password
    });
    newUser
    .save()
    .then(user=>{
        if (!user) {
            return res.status(400).send(
                {error:{
                    name:"", 
                    message:"User not created"}
                })
        }
        console.log("usser created");
        return res.status(201).send();
    })
    .catch(err=>{
        if(err){
            return res.status(400).send(err)
        }
        return res.status(400).send()
    })
})




module.exports = router;