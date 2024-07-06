
'use strict';

const express = require('express');
const cors = require("cors");
require("dotenv").config();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


// App
const app = express();

//cors
let corsOptions = {
    origin: `http://${HOST}:${PORT}`,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });

app.get('/', (req, res) => {
    res.send('Hello Worlds');
});

require("./app/routes")(app);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
