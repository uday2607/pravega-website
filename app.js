const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));

// Base route
app.get('/', (req, res) => {
    res.send('<style>body{text-align:center}</style><br><br>Server for Pravega 2020. <br> All rights reserved');
})

// Initialize mongoose
mongoose.connect('mongodb://localhost/pravega', { useNewUrlParser: true });
var db = mongoose.connection;

// Check if connection was successful
db.on('error', (e) => { console.log('Mongoose connection error: No Mongo Instance running ') });

// Run the rest of the program only if db connection is succesful
db.once('open', (e) => {

    /*
    Initializing models
        Registered poeple will be alloted a team id,
        MAny people with the same id are the part of the team
        Front end verification needs to be present ! Backend can't verify  ( I'm too lazy to put validation)
    */

    var teamSchema = new mongoose.Schema({
        "members": [{
            "name": String,
            "noa": String,
            "yos": String,
            "course": String,
            "email": String,
            "teamID": Number
        }],
        "noi": String,
        "aoi": String,
        "teamName": String,
        "event": String
    })


    var team = mongoose.model('team', teamSchema);

    // Find all registrations
    app.get('/registrations', (req, res) => {

        team.find((err, data) => {
            if (err) throw err;
            res.send(data);
        })

    });

    app.get('/api/registrations/', (req, res) => {

        // To prevent server crashing when someone (eyeroll) sends wrong request

        try {
            team.find({}, (err, data) => {
                if (err) throw err;
                res.send(data);
            })
        } catch (e) {
            res.send(e);
        }
    })


    app.post('/api/register', (req, res) => {

        // To prevent server crash when invalid request sent
        try {

            // Defining a data object to make it easy to refer to.
            var data = req.body;

            // Setting a teamName if not provided
            // FIXME: Remove after frontEnd validation
            if (!data.teamName) {
                data.teamName = data.noi + "<NOTPROVIDED>"
            }

            // Defining new team as from data
            var temp = new team(data);

            // Find all data, count and add the next one after that //
            /* This required some extra thought as this is an async process and
            and return statement was getting called before it finished.
            Alsoo, mongoose right now doesn't have promises so
            */
            team.find((err, data) => {
                console.log(data.length);
                temp._id = mongoose.Types.ObjectId(data.length);
                temp.save((err, data) => {
                    res.send(parseInt(data._id, 16) + "");
                });
            })

        //FIXME: Should I send error to front end ?
        } catch (e) {
            console.log(e);
            res.send(e);
        }
    });

    // Any iiscian will know this why I chose that number
    var port = 1909;
    app.listen(port);
    console.log('Server running on PORT : ' + port);

});
