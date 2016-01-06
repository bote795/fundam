var io;
var gameSocket;
var readys={};
/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected! Choose a room" , rooms:  io.sockets.adapter.rooms,
    connectedRooms: socket.rooms});

    // Host Events
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);

    // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);
    gameSocket.on('playerMove', playerMove);
    gameSocket.on('ready',ready);
    console.log(socket.rooms);

}
//host

function hostCreateNewGame(data) 
{
    var socket = this;
    //create a new room and join
    socket.join(data.name);
    console.log("joined new room"+data.name);
    console.log(this.rooms);
    socket.emit('newGameCreated', {name: data.name, userName: data.userName, player: 1});
    io.emit("newRoom", {rooms:  io.sockets.adapter.rooms})
};


//player

function playerJoinGame (data) {
    var socket = this;
    var room = io.sockets.adapter.rooms[data.name];
    if (room)
    {
        console.log(data.name);
        socket.leave(socket.rooms[0]);
        socket.join(data.name);
        data.num= Object.keys(io.sockets.adapter.rooms[data.name]).length;
        console.log(data.num);
        data.player =2;
        io.sockets.in(data.name).emit('playerJoinedGame',data)
    }
    else
    {
        socket.emit('error', {message: "This room doesn't exist"});
    }

}
function playerMove (data) {
    io.sockets.in(data.room).emit('playerMove',data);
}
function ready (data) {
    console.log('ready');
    if (readys.hasOwnProperty(data.room)) 
    {
        var array= readys[data.room];
        array.push(data.userName);
    }
    else
        readys[data.room]=[data.userName];
    console.log(readys);
    if(readys[data.room].length ==2)
    {
        io.sockets.in(data.room).emit('start');
        console.log("sent start");
    }
}