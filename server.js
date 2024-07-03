
'use strict';

const express = require('express');
const cors = require("cors");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

//cors
let corsOptions = {
    origin: `http://${HOST}:${PORT}`
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello Worldss');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
