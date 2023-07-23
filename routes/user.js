const express = require('express');
const userRouter = express();
const auth = require('../middlewares/auth_middleware');
const { Product } = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');


userRouter.post('/api/add-to-cart', auth, async (req, res) => {

    try {
        const { productId } = req.body;
        let product = await Product.findById(productId);
        let user = await User.findById(req.id);
        let productFound = false;
        if (user.cart.length == 0) {

            user.cart.push(
                {
                    product: product,
                    quantity: 1
                }

            );
        }
        else {

            for (let i = 0; i < user.cart.length; i++) {
                if (user.cart[i].product._id.equals(product._id)) {

                    productFound = true;


                }

            }

            if (productFound) {


                let producttt = user.cart.find((productt) => {


                    return productt.product._id.equals(product._id);
                });

                producttt.quantity = producttt.quantity + 1;

            }
            else {

                user.cart.push(
                    {
                        product: product,
                        quantity: 1
                    }

                );
            }


        }

        user = await user.save();
        res.json(user);
    }
    catch (e) {
        res.status(500).json({ error: e.message + 'server' });
    }

});


userRouter.delete('/api/remove-from-cart/:id', auth, async (req, res) => {



    try {
        let user = await User.findById(req.id);

        for (let i = 0; i < user.cart.length; i++) {

            if (user.cart[i]._id == req.params.id) {

                if (user.cart[i].quantity == 1) {
                    user.cart.splice(i, 1);
                }
                else {
                    user.cart[i].quantity -= 1;
                }



            }
        }
        user = await user.save();
        res.json(user);


    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.post('/api/save-user-address', auth, async (req, res) => {

    try {
        const userId = req.id;
        const { address } = req.body;
        let user = await User.findById(userId);

        user.address = address;
        user = await user.save();
        res.json(user);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }


});

userRouter.post('/api/order', auth, async (req, res) => {

    try {
        const { cart, totalPrice, address } = req.body;

        let user = await User.findById(req.id);
        let productsList = [];


        for (let i = 0; i < user.cart.length; i++) {
            let product = await Product.findById(cart[i].product._id);



            if (product.quantity >= cart[i].quantity) {

                product.quantity = product.quantity - cart[i].quantity;
                productsList.push({ product, quantity: cart[i].quantity, });
                await product.save();

            }
            else {
                return res.status(401).json({ message: `${product.name} is out of stock` });
            }

        }
        user.cart = [];
        await user.save();

        let order = new Order({
            userId: req.id,
            productDetails: productsList,
            totalPrice: totalPrice,
            address: address,
            orderedAt: Date.now(),
            status: 0
        });

        order = await order.save();
        res.json(order);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }


});

userRouter.get('/api/getOrders', auth, async (req, res) => {
    const temp = "649ab2592e488242a0d7b51a";
    const orders = await Order.find({ userId: temp });
    res.json(orders);
});

module.exports = userRouter;