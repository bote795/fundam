var io;
var gameSocket;
var readys={};
var roomNames={};

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;

    
    socket.join('lobby');
    //socket.leave(socket.id);

    gameSocket.emit('connected', { message: "You are connected! Choose a room" , rooms:  roomNames,
    connectedRooms: socket.rooms});
    // Host Events
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);

    // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);
    gameSocket.on('playerMove', playerMove);
    gameSocket.on('ready',ready);
    gameSocket.on('disconnect',disconnect);

}
//host

function hostCreateNewGame(data) 
{
    var socket = this;
    //create a new room and join
    socket.join(data.name);
    socket.leave('lobby');
    console.log("joined new room"+data.name);
    console.log(this.rooms);
    roomNames[data.name] =[socket.id];
    socket.emit('newGameCreated', {name: data.name, userName: data.userName, player: 1});
    io.emit("newRoom", {rooms:  roomNames})
};


//player

function playerJoinGame (data) {
    var socket = this;
    var room = io.sockets.adapter.rooms[data.name];
    if (room)
    {
        console.log(data.name);
        socket.leave('lobby');
        socket.join(data.name);
        data.num= Object.keys(io.sockets.adapter.rooms[data.name]).length;
        console.log(data.num);
        data.player =2;
        roomNames[data.name].push(socket.id);
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
        if (array.indexOf(data.userName) == -1)
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

function disconnect () {
    console.log("disconnected");
    for (var key in roomNames)
    {
        var test = roomNames[key];
        console.log(gameSocket.id);
       for (var j = 0; j < test.length; j++) {
           if(roomNames[key][j] == gameSocket.id)
           {
                roomNames[key].splice(j,1);
                if (roomNames[key]==0) 
                {
                    delete roomNames[key]
                };
           }
       };
    }
}