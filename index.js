var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// comment
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('change message', function(msg){
        console.log(msg.id + '::' + msg.string);
        // @aalvad
        //setTimeout(function(){
                //console.log("emit executes")
        io.emit('change message', msg);
        //}, 10000);
    });
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
