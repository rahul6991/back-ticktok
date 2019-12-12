const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const User = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'User email required'],
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Provide valid email.'
        }
    },
    mobile: {
        type: String,
        required: [true, 'User phone number required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v)
            },
            message: 'Provide 10-digit mobile number.'
        }
    },
    password: {
        type: String,
        required: [true, 'User password required'],
        trim: true,
        minlength: [8, "Provide password  greater than 8"]
    },
    date: { type: Date, default: Date.now }
})


User.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    bcrypt.genSalt(12, (err, salt) => {
        if (err) {
            return Promise.reject(err)
        }
        bcrypt.hash(this.password, salt, (err, hashed) => {
            if(err){
                return Promise.reject(err)
            }
            this.password = hashed;
            next();
        });
    })
})

module.exports = mongoose.model('User', User);

