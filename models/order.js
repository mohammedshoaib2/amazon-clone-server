const mongoose = require('mongoose');
const { ProductSchema } = require('./product');

const OrderSchema = mongoose.Schema(
    {

        productDetails: [
            {
                product: ProductSchema,
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],

        userId: {
            type: String,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        orderedAt: {
            type: Number,
            required: true
        },

        status: {
            type: Number,
            default: 0
        }
    }
);

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;