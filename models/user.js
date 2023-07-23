const mongoose = require('mongoose');
const { ProductSchema } = require('../models/product');


const UserSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: (value) => {
                let re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message: "Please Enter a Valid Email Address"

        }

    },
    password: {

        required: true,
        type: String,
        validate: {
            validator: (password) => {
                return password.length >= 6;
            },
            message: "Password must be 6 characters longer!"
        }
    },

    address: {
        type: String,
        default: ""
    },

    type: {
        type: String,
        default: "user"
    },

    cart: [
        {
            product: ProductSchema,
            quantity: {
                type: Number,
                required: true
            }

        }
    ]

});

const User = mongoose.model('users', UserSchema);

module.exports = User;


