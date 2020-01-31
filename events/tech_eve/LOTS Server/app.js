// LOTS Server | Pravega 2020
// Chinmay K Haritas - 2020

const express = require('express');
const app = express();

const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const formidable = require('formidable');

const fs = require('fs')

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/front_end'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/front_end/login.html')
})

app.get('/submission', (req, res) => {
  res.sendFile(__dirname+'/front_end/submission.html');
})

// Accept incoming files and store them in the respective folders
app.post('/submission', (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var folderName = fields.teamName;
    console.log(folderName);
    // If dir exists then add it there
    if (fs.existsSync(__dirname + "/public/" + folderName)) {
      var newpath = __dirname + "/public/" + folderName+"/" + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.send('Saved to Server')
      });
    } else{
      fs.mkdirSync(__dirname+'/public/'+folderName+'/');
      var newpath = __dirname + "/public/"+ folderName+'/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.send('Saved to Server')
      });
    }

  });
})

// Accepting auth and do the same
app.post('/homepage',(req,res)=>{
  var folderName = req.body.email;
  if (fs.existsSync(__dirname + "/public/" + folderName)) {
    res.send('/'+folderName+'/home.html');
  } else{
    fs.mkdirSync(__dirname+'/public/'+folderName+'/');
    var newpath = __dirname + "/public/"+ folderName+'/home.html'
    fs.readFile(__dirname+'/front_end/home.html',(err,data)=>{
      if(err){ throw err};
      fs.writeFile(__dirname+'/public/'+folderName+'/home.html',data,(e)=>{//Void callback
        res.send('/'+folderName+'/home.html');
      })
    })
  }
})

fs.readFile('./customer.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    console.log('File data:', jsonString)
})

app.listen(2020, () => {
  console.log('Server running on PORT: 2020')
});
