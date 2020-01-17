// Server for Pravega Website 2020
// Author : Chinmay K Haritas
// All rights reserved
var sslRedirect = require('heroku-ssl-redirect');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { Parser } = require('json2csv');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));
app.use(sslRedirect());

// Base route
app.get('/', (req, res) => {
    res.send('<style>body{text-align:center}</style><br><br>Server for Pravega 2020. <br> All rights reserved');
})

// Initialize mongoose

var url = 'mongodb://localhost/pravega';
var uri = 'mongodb+srv://pravega_developer:123qwerty@pravega-qebux.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(uri, { useNewUrlParser: true });
var db = mongoose.connection;

// Check if connection was successful
db.on('error', (e) => { console.log('Mongoose connection error: No Mongo Instance running ') });

// Run the rest of the program only if db connection is succesful
db.once('open', (e) => {


    // Node mailer create transport

    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "pravega.website@gmail.com",
            pass: "#123@qwerty!"
        }
    });

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
        "phone": mongoose.Schema.Types.Mixed,
        "email": String,
        "meta": mongoose.Schema.Types.Mixed,
        "pword": mongoose.Schema.Types.Mixed
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
            data.pword = Math.floor(Math.random() * 10000);
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
                    if (err) throw err;

                    // Send mail

                    var mailOptions = {
                        from: '"Team Pravega"<pravega.website@gmail.com>',
                        to: data.email,
                        subject: 'Pravega Registration',
                        html: '<div style=" text-align:center;background-color:lightblue;"><img src="https://www.pravega.org/img/blue_light_trans-01.png" style="height: 6em;">&nbsp;&nbsp;<img src="https://www.pravega.org/img/footer.png" style="height: 4em;"><h2 style="background-color: blue;"><br></h2><p>Your team has been successfully registered</p><p>Event :  ' + data.event + '</p><p>Contact : ' + data.phone + '</p><p>Institute : ' + data.noi + '</p><p>Stay tuned to <a href="https://www.pravega.org/">the website</a> for updates !</p><br><br><h5 style="font-weight: 200;">If the above details are incorrect, you can contact us ! Contact details on the website</h5></div><style>    #main{width:100%;height:auto;background-color:coral;padding: 20px;font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;}</style>'
                    }

                    transporter.sendMail(mailOptions, function (error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            res.redirect('/');
                        }
                    });

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

        const fields = ['member0','member1','member2','noi','phone','email','pword','category','teamName'];
        const opts = { fields };


        team.find({ "event": "chemenigma" }, (err, myData) => {

            var finalData =[]

            myData.forEach(element => {
                var temp={};
                if(element.members[0]){
                    temp['member0']=element.members[0];
                }
                if(element.members[1]){
                    temp['member1']=element.members[1];
                }
                if(element.members[0]){
                    temp['member2']=element.members[2];
                }
                temp['noi'] = element.noi;
                temp['teamName'] = element.teamName;
                temp['phone'] = element.phone;
                temp['category'] = element.meta.category;
                temp['email'] = element.email;
                temp['pword'] = element.pword;
                finalData.push(temp);
                temp = {};
            });

            try {
                const parser = new Parser(opts);
                const csv = parser.parse(finalData);
                console.log(csv);
                res.send(csv);
            } catch (err) {
                console.error(err);
                res.send(err);
            }
        })
    });

    app.get('/format', (req, res) => {
        team.find({ "event": "chemenigma" }, (err, data) => {
            if (err) throw err;
            res.send(data);
        })
    })


    // Password Generation

    // app.get('/pword/gen',(req,res)=>{
    //     try{
    //     team.find((err,data)=>{
    //         if(err) throw err;
    //         data.forEach(element => {
    //             element.pword = Math.floor(Math.random()*10000);
    //             console.log(element);
    //             team.findOneAndUpdate({_id:element._id},element,(e,d)=>{
    //                 if(e) throw e;
    //                 console.log(d);
    //             })
    //         });
    //         res.send(data.length+"");
    //     })
    //     } catch(e){
    //         console.log(e);
    //         res.send(e);
    //     }
    // })

    // Login Auth
    app.post('/auth', (req, res) => {
        console.log(req.body);
        try {
            team.findOne({ email: req.body.email }, (err, data) => {
                console.log(data)
                if (err) {
                    res.send('Error on database, Contact Team pravega if problem persists');
                }
                if (data) {
                    if (req.body.pword == data.pword) {
                        res.send('Success');
                        console.log('Auth Success');
                    } else {
                        res.send('Auth failed: Wrong Password');
                        console.log('Auth Failed: Wrong Password')
                    }
                } else {
                    res.send('Auth failed: No such email exists !')
                }
            })
        } catch (error) {
            console.log(error);
        }
    })

    app.get('/api/registrations/email/:email', (req, res) => {
        console.log(req.params.email)
        team.find({ email: req.params.email }, (e, data) => {
            if (e) throw e;
            res.send(data);
        })
    })

    app.get('/api/registrations/event/:event', (req, res) => {
        console.log(req.params.event)
        team.find({ event: req.params.event }, (e, data) => {
            if (e) throw e;
            res.send(data);
        })
    })

    // app.get('/sendMail', (req, res) => {
    //     res.send('Sending');
    //     sendMail();
    // })

    // var count = 0;



    // function sendMail() {
    //     team.find({ "event": "whodunnit" }, (err, data) => {

    //             var postMan = data[count];

    //             var htmlString = '<div style="text-align:center;background-color:lightblue;"><img src="https://www.pravega.org/img/blue_light_trans-01.png" style="height: 6em;">&nbsp;&nbsp;<img src="https://www.pravega.org/img/footer.png" style="height: 4em;"><h2 style="background-color: blue;"><br></h2><p>Your Whodunnit Credentials are as follows</p><p>Email :  ' + postMan.email + ' (The recipient of this Email)</p><p>Password : ' + postMan.pword + '</p><p>Stay tuned to <a href="https://www.pravega.org/">the website</a> for updates !</p><br><p>Please ignore this mail if you have already recieved it.</p><br><h5 style="font-weight: 200;">If the above details are incorrect, you can contact us ! Contact details on the website</h5></div><style>    #main{width:100%;height:auto;background-color:coral;padding: 20px;font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;}</style>'

    //             var mailOptions = {
    //                 from: '"Team Pravega"<pravega.website@gmail.com>',
    //                 to: postMan.email,
    //                 subject: 'Whodunnit Login Details | Pravega 2020',
    //                 html: htmlString
    //             }

    //             try {

    //             } catch (error) {

    //             }
    //             transporter.sendMail(mailOptions, function (error, response) {
    //                 if (error) {
    //                     console.log(error);
    //                 } else {
    //                     count++;
    //                     console.log(count);
    //                     if (count == 58) {
    //                         console.log('done');
    //                     } else {
    //                         sendMail();
    //                     }
    //                 }
    //             });

    //     })
    // }




    app.get('/dupes/:event', (req, res) => {
        var dupes = 0;
        var seen = [];
        var duplicates = []
        team.find({ "event": req.params.event }, (err, data) => {
            if (err) { throw err }
            data.forEach(element => {
                if (seen.indexOf(element.email) != -1) {
                    dupes++;
                    team.find({ "event": req.params.event, "email": element.email }, (e, d) => {
                        if (e) throw e;
                        console.log(d);
                        duplicates.concat(d);
                    })
                } else {
                    seen.push(element.email);
                }
            });
            console.log(duplicates.length);
            console.log(dupes);
            res.send(dupes + "");
        })
    })

    app.get('/api/delete/id/:id', (req, res) => {
        team.deleteOne({ "_id": req.params.id }, (err) => {
            if (err) { throw err };
            res.send('deleted');
        })
    })

    app.listen(process.env.PORT || 5000, (e) => {
        console.log("The Server is running on port number " + 5000)
    })

});
