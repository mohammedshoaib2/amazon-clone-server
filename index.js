const express = require('express');
const app = express();
require("./config");
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/products');
const ratingRouter = require('./routes/ratings');
const userRouter = require('./routes/user');
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(ratingRouter);
app.use(userRouter);



app.use('/check', (req, res) => {
    res.json({ success: "Connected" });
});


app.listen(PORT, "0.0.0.0");

//192.168.1.5:3000
