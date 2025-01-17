
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
const Role = db.role;
const Division = db.division;
db.sequelize.sync()
    .then(() => {
        // initial();
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// db.sequelize.sync({ force: true }).then(() => {
//     initial();
//     console.log("Drop and re-sync db.");
// });

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "moderator"
    });

    Role.create({
        id: 3,
        name: "admin"
    });

    Division.create({
        id : 1,
        name : "Division 1",
        remark : "Division 1"
    });

    Division.create({
        id : 2,
        name : "Division 2",
        remark : "Division 2"
    });

    Division.create({
        id : 3,
        name : "Division 3",
        remark : "Division 3"
    })

}

app.get('/', (req, res) => {
    res.send('Hello Worlds');
});

require("./app/routes")(app);
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
