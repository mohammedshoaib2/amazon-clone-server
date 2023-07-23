const express = require('express');
const User = require('../models/user');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth_middleware');





authRouter.post('/api/signup', async (req, res) => {



    try {
        const { name, email, password } = req.body;

        const isUserExist = await User.findOne({ email: email });
        if (isUserExist) {
            return res.status(400).json({ message: "User with the same email already exists!" });
        }

        const passEncryption = await bcrypt.hash(req.body.password, 8);
        if (!(password.length >= 6)) {

            return res.status(500).json({ error: "Password must be 6 characters Longer" });
        }

        let user = new User(
            {
                name: name,
                email: email,
                password: passEncryption,
            }
        );
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

});

authRouter.post('/api/signin', async (req, res) => {

    try {
        const { email, password } = req.body;


        let user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist's!" });

        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password!" });

        }
        const token = jwt.sign({ id: user._id, name: user.name }, "862A45CC81BAF48D9CD4CEEBE635D");

        res.json({
            token: token,
            ...user._doc
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }

});


authRouter.post('/tokenIsValid', async (req, res) => {

    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.json(false);
        }

        const isVerified = jwt.verify(token, "862A45CC81BAF48D9CD4CEEBE635D");
        if (!isVerified) {
            return res.json(false);
        }

        const user = await User.findById(isVerified.id);
        if (!user) {
            return res.json(false);
        }

        res.json(true);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }





});


authRouter.get('/', auth, async (req, res) => {

    try {

        const user_id = req.id;
        const token = req.token;

        const user = await User.findById(user_id);

        res.json({
            ...user._doc,
            token

        });

    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports = authRouter;