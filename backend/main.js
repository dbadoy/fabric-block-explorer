const express = require("express");
const bodyParser = require('body-parser');

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

const poolRouter = require("./api/pool");
app.use('/pool', poolRouter);

const blockRouter = require("./api/block");
app.use('/block', blockRouter);

app.listen(port, () => {
    console.log("Server is running on port:" + port);
});
