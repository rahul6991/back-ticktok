const express = require('express')
const router = express.Router();
const User = require('./../db/models/user-modal');
const authentication = require('../middleware/authentication');
require('dotenv/config')

router.get('/', authentication, (req, res) => {
    User
        .findById(req._id).then((user) => {
            if (!user) {
                return res.status(400).send();// Invalid credentials
            }
            const { email, mobile, name } = user;
            const payload = { email, mobile, name }
            return res.status(200).send(payload);
        })
        .catch(err => {
            if (err) return res.status(401).send(err);
            return res.status(401).send()
        })
})

router.get('/users', authentication, (req, res) => {
    User
        .find({})
        .then(users => {
            if (!users) {
                return res.status(401).send()
            }
            let filteredUsers = users.map((user) => {
                const { name, email, mobile } = user;
                let userDetail = { name, email, mobile };

                return userDetail;
            });
            return res.status(200).send(filteredUsers);
        }).catch(err => {
            if (err) return res.status(401).send(err);
            return res.status(401).send()
        })
})

module.exports = router;