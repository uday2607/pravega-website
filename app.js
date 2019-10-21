// Server for Pravega Website 2020
// Author : Chinmay K Haritas 
// All rights reserved

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { Parser } = require('json2csv');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Base route
app.get('/', (req, res) => {
    res.send('<style>body{text-align:center}</style><br><br>Server for Pravega 2020. <br> All rights reserved');
})

// Initialize mongoose

var url = 'mongodb://localhost/pravega';
var uri = 'mongodb+srv://pravega_developer:vmt@pravega-qebux.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(uri, { useNewUrlParser: true });
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

    // Schema for team object
    var teamSchema = new mongoose.Schema({
        "members": [String],
        "noi": String,
        "teamName": String,
        "event": String,
        "phone":Number,
        "email":String,
        "meta": mongoose.Schema.Types.Mixed
    })

    // Construct team as mongoose object
    var team = mongoose.model('teams', teamSchema);

    
    // Get all registrations 
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

    // Register
    app.post('/api/register', (req, res) => {

        // To prevent server crash when invalid request sent
        try {

            // Defining a data object to make it easy to refer to.
            var data = req.body;
            console.log(data);

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
                temp.save((err, data) => {
                    if(err) throw err;
                    res.send(data);
                });
            })

            //FIXME: Should I send error to front end ?     
        } catch (e) {
            console.log(e);
            res.send(e);
        }
    });

    // Update the team
    app.post('/api/team/update', (req, res) => {
        try {
            var _id = req.body._id;
            var update = req.body.update;
            team.findOneAndUpdate({ _id: _id }, update, (err, data) => {
                if (err) { throw err; }
                res.send('OK');
            });
        } catch (e) {
            res.send('Oops!');
        }
    })

    // Route to get csv
    app.get('/api/csv/reg', (req, res) => {
        const { Parser } = require('json2csv');

        const fields = ['_id', 'noi', 'aoi', 'members'];
        const opts = { fields };

        team.find((err, myData) => {
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(myData);
                res.send(csv)
            } catch (err) {
                console.error(err);
                res.send(err);
            }
        })
    });

    app.listen(process.env.PORT || 5000, (e) => {
		console.log("The Server is running on port number " + 5000)
	})

});
