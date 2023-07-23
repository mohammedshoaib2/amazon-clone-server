const express = require('express');
const adminRouter = express.Router();
const jwt = require('jsonwebtoken');
const admin = require('../middlewares/admin_middleware');
const { Product } = require('../models/product');
const Order = require('../models/order');

adminRouter.post('/admin/add-product', admin, async (req, res) => {

    try {


        const { name, description, images, quantity, price, category } = req.body;
        let product = new Product({
            name: name,
            description: description,
            images: images,
            quantity: quantity,
            price: price,
            category: category
        });

        product = await product.save();

        res.json(product);



    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }

});

adminRouter.get('/admin/get-products', admin, async (req, res) => {


    try {

        const allProducts = await Product.find({});
        res.json(allProducts);


    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.post('/admin/delete-product', admin, async (req, res) => {



    try {
        const id = req.header('id');
        const result = await Product.findByIdAndDelete(id);
        res.json(result);
    }
    catch (e) {

        res.status(500).json({ error: e.message });
    }
});

adminRouter.get('/admin/get_orders', admin, async (req, res) => {

    try {

        const orders = await Order.find({});
        res.json(orders);

    } catch (e) {
        res.statusCode(500).json({ error: e.message });
    }

});

adminRouter.post('/admin/upate_status', admin, async (req, res) => {
    try {

        const { orderId, status } = req.body;


        let order = await Order.findById(orderId);

        order.status = status;
        order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.get('/admin/analytics', admin, async (req, res) => {

    try {

        let orders = await Order.find({});

        let totalEarnings = 0;

        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].productDetails.length; j++) {
                totalEarnings = totalEarnings + (orders[i].productDetails[j].product.price * orders[i].productDetails[j].quantity);

            }
        }

        const appliancesEarnings = await fetchCategoryEarnings('Appliances');
        const mobilesEarnings = await fetchCategoryEarnings('Mobiles');
        const essentialsEarnings = await fetchCategoryEarnings('Essentials');
        const booksEarnings = await fetchCategoryEarnings('Books');
        const fashionsEarnings = await fetchCategoryEarnings('Fashion');

        res.json({
            totalEarnings: totalEarnings,
            appliancesEarnings: appliancesEarnings,
            mobilesEarnings: mobilesEarnings,
            essentialsEarnings: essentialsEarnings,
            booksEarnings: booksEarnings,
            fashionsEarnings: fashionsEarnings

        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }

});

const fetchCategoryEarnings = async (category) => {


    const categoryOrders = await Order.find({
        'productDetails.product.category': category
    });
    let categoryEarnings = 0;

    for (let i = 0; i < categoryOrders.length; i++) {

        for (let j = 0; j < categoryOrders[i].productDetails.length; j++) {

            categoryEarnings = categoryEarnings + (categoryOrders[i].productDetails[j].product.price * categoryOrders[i].productDetails[j].quantity);

        }
    }



    return categoryEarnings;
}

module.exports = adminRouter;