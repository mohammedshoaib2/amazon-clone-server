const jwt = require('jsonwebtoken');
const User = require('../models/user');
const admin = async (req, res, next) => {



    try {
        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(500).json({ message: "Token is Empty" });
        }

        const isVerifiedToken = jwt.verify(token, '862A45CC81BAF48D9CD4CEEBE635D');
        if (!isVerifiedToken) {
            return res.status(401).json({ message: "Unauthorized access!" });
        }

        const userData = await User.findById(isVerifiedToken.id);
        if (userData.type == 'user' || userData.type == 'seller') {
            return res.status(401).json({ message: "Unauthorized access, you are not the admin!" });
        }


        req.token = token;
        req.user = isVerifiedToken.id;
        next();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }


}

module.exports = admin;
