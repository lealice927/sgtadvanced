const express = require('express'); //load the express library into the file
const mysql = require('mysql'); //load the mysql library
const mysqlcredentials = require('./mysqlcreds.js'); //load the credentials
const cors = require('cors');

//using the credientials that we loaded, establish a preliminary connection to the database
const db = mysql.createConnection(mysqlcredentials);

const server = express();

server.use(cors()); //cors() is a method, this will allow us to gain access from CORS
server.use(express.static(__dirname + '/html')); //__dirname (directory name) is the pathway
server.use(express.urlencoded({ extended: false })) //have express pull body data that is urlencoded and place it into an object called "body"
server.use(express.json()) //use for things like axios

//make an endpoint to handle retrieving the grades of all students
server.get('/api/grades', (req, res) => { //this is an EVENT! when this server receives the url from the port 3001, run this function (req,res)
    //establish the connection to the database, and call the callback function when connection is made
    db.connect(() => {
        //create a query for our desired operation
        const query = 'SELECT `id`, CONCAT(`givenname`," ",`surname`) AS `name`, `course`, `grade` FROM `grades`';
        // establish a query to the database, and call the given callback function once the data is retrieved or an error happens
        db.query(query, (error, data) => {
            //if error is null, no error occured
            //create an output object to be sent back to the client
            const output = {
                success: false,
            }
            //if error is null, send the data
            if (!error) {
                //notify the client that we were successful
                output.success = true;
                //attach the data from the database to the output object
                output.data = data;
            } else {
                //an error occured, attach that error onto the output so we can see what happened
                output.error = error;
            }
            //send the data back to the client
            res.send(output);
        })
    })
})

// INSERT INTO `grades` SET `surname`="Le", `givenname`="Alice",`course`="math", `grade`=100, `added`=NOW()

server.post('/api/grades', (request, response) => {
    if (request.body.name === undefined || request.body.course === undefined || request.body.grade === undefined) {
        response.send({
            //respond to the client with an appropriate error message
            success: false,
            error: 'invalid name, course, or grade'
        });
        //if it doesn't return anything, exits the function
        return;
    }
    //connect to the database
    db.connect(() => {
        const name = request.body.name.split(" ");
        const grade = request.body.grade;
        const query = 'INSERT INTO `grades` SET `surname`="' + name[1] + '", `givenname`="' + name[0] + '",`course`="' + request.body.course + '", `grade`="' + grade + '", `added`=NOW()';
        db.query(query, (error, result) => {
            if (!error) {
                response.send({
                    success: true,
                    new_id: result.insertId
                })
            } else {
                response.send({
                    success: false,
                    error //this is the same as error: error but with es6 and structuring, we can leave it as is
                })
            }
        })
        // response.send(query);
    })
})

server.delete('/api/grades/:student_id', (request, response) => {
    console.log(request.params);
    if (request.params.student_id === undefined) {
        response.send({
            success: false,
            error: 'must provide a student id for delete'
        });
        return;
    }
    db.connect(() => {
        const query = "DELETE FROM `grades` WHERE `id`= " + request.params.student_id;
        db.query(query, (error, result) => {
            if (!error) {
                response.send({
                    success: true,
                })
            } else {
                response.send({
                    success: false,
                    error
                })
            }
        })
    })
})

server.listen(3001, () => {  //listen is a function, wants 2 parameters (the port that it will open up on, and the callback function)
    // console.log('server is running on port 3001');
    console.log('carrier has arrived');
})

