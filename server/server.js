const express = require('express'); //load the express library into the file
const mysql = require('mysql');
const mysqlcredentials = require('./mysqlcreds.js');

const db = mysql.createConnection(mysqlcredentials);

const server = express();

server.use(express.static( __dirname + '/html')); //__dirname (directory name) is the pathway

server.get('/api/grades',(request, response)=>{
    response.send(`{
        "success": true,
        "data": [{
            "id": 10,
            "name": "Alice Le",
            "course": "Linear Algebra",
            "grade": 80
        }, {
            "id": 12,
            "name": "Sandy Happyfeet",
            "course": "Penguin Dancing",
            "grade": 80
        }, {
            "id": 10,
            "name": "Chewie Bacca",
            "course": "Porg Roasting",
            "grade": 89
        }]
    }`)
}); //putting api doesn't do anything, just putting it here bc every path will be named api for our purpose here
                            // this can be called anything you want...

server.listen(3001, () => {  //listen is a function, wants 2 parameters (the port that it will open up on, and the callback function)
    // console.log('server is running on port 3001');
    console.log('carrier has arrived');
})

