

const express = require('express'); //load the express library into the file

const server = express();

server.use(express.static( __dirname + '/html'));

var insults = [
    'your father smelt of elderberries', 
    'you program on an altaire', 
    'I bet you still use var',
    'one line functions are for chumps'
]
//1)the path to listen for
//2)the callback function to call once that path has been received
server.get('/', function (request, response) {
    //an object representing all of the data coming from the client to the server
    //an object representing all of the data going from the server to the client
    response.send('Hello, World.');
});

server.get('/time', (request, response) => {
    var now = new Date();
    response.send(now.toLocaleDateString())
})

server.get('/insult', (request, response) => {
    const randomInsult = insults[ (Math.random() * insults.length)>>0];
})



server.listen(3001, () => {  //listen is a function, wants 2 parameters (the port that it will open up on, and the callback function)
    // console.log('server is running on port 3001');
    console.log('carrier has arrived');
})

