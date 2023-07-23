const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {



    try {
        const token = req.header("x-auth-token");

        if (!token) {
            return res.status(401).json({ message: "Token is Empty" });
        }

        isVerified = jwt.verify(token, "862A45CC81BAF48D9CD4CEEBE635D");
        if (!isVerified) {
            return res.status(401).json({ message: "Unauthorized Access" });
        }
        req.token = token;
        req.id = isVerified.id;
        next();

    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}

module.exports = auth;