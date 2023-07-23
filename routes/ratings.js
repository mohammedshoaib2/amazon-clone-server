const express = require('express');

const ratingRouter = express.Router();
const { Product } = require('../models/product');
const auth = require('../middlewares/auth_middleware');


ratingRouter.post('/api/rate-product', auth, async (req, res) => {

    try {
        const { productId, rating } = req.body;

        let product = await Product.findById(productId);


        for (let i = 0; i < product.rating.length; i++) {
            if (product.rating[i].userId == req.id) {
                product.rating.splice(i, 1);
                break;
            }
        }






        product.rating.push(
            {
                userId: req.id,
                rating: rating
            }
        );

        const updatedProduct = await product.save();






        res.json(updatedProduct);
    }

    catch (e) {
        res.status(500).json({ error: e.message });
    }




});

module.exports = ratingRouter;