const mongoose = require('mongoose');
const Rating = require('../models/rating');

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true

        },
        images:
        {
            type: Array,
            required: true

        },
        category:
        {
            type: String,
            required: true

        },

        rating: [Rating]

    }
);

const Product = mongoose.model('products', ProductSchema);

module.exports = { Product, ProductSchema };