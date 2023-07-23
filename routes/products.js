const express = require('express');
const productRouter = express.Router();
const { Product } = require('../models/product');
const auth = require('../middlewares/auth_middleware');


productRouter.get('/api/products', async (req, res) => {

    try {
        const category = req.query.category;

        const data = await Product.find({ category: category });
        res.json(data);

    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }

})

productRouter.get('/api/products/search/:query', auth, async (req, res) => {

    try {
        const searchQuery = req.params.query;

        const result = await Product.find({
            name: {
                $regex: searchQuery,
                $options: 'i'
            },

        });

        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }

});


productRouter.get('/api/deal-of-the-day', auth, async (req, res) => {

    try {

        let maxRatedProduct;
        let maxRatedProductID;
        let maxRating = 0;
        let maxRatedProductIndex;

        const products = await Product.find({});
        for (let i = 0; i < products.length; i++) {
            let totalRating = 0;
            for (let j = 0; j < products[i].rating.length; j++) {

                totalRating = totalRating + products[i].rating[j].rating;


            }
            if (totalRating > maxRating) {
                maxRating = totalRating;

                maxRatedProductID = products[i]._id;
                maxRatedProductIndex = i;
            }

        }

        res.json(products[maxRatedProductIndex]);


        // let products = await Product.find({});


        // products = products.sort((a, b) => {
        //     let aSum = 0;
        //     let bSum = 0;



        //     for (let i = 0; i < a.rating.length; i++) {
        //         aSum = aSum + a.rating[i].rating;
        //         console.log(i);
        //     }
        //     for (let i = 0; i < a.rating.length; i++) {
        //         bSum = bSum + b.rating[i].rating;
        //     }

        //     // 1 -> add to starting
        //     // -1 -> don't add
        //     return aSum < bSum ? 1 : -1;


        // });



        // res.json(products[0]);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }

});

module.exports = productRouter;