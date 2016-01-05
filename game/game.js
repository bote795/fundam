var io;
var gameSocket;

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
        console.log(socket.rooms);

}

function hostCreateNewGame(data) 
{
    var socket = this;
    //create a new room and join
    socket.join(data.name);
    console.log("joined new room"+data.name);
    console.log(this.rooms);
    socket.emit('newGameCreated', {name: data.name, userName: data.userName});
    io.emit("newRoom", {rooms:  io.sockets.adapter.rooms})
};

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
        io.sockets.in(data.name).emit('playerJoinedGame',data)
    }
    else
    {
        socket.emit('error', {message: "This room doesn't exist"});
    }

}