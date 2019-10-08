const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    console.log(req.ips);
    res.send('<style>body{text-align:center}</style>Server for Pravega 2020. <br> All rights reserved');
})


app.listen(1909);
console.log('Server running on PORT : 1909')