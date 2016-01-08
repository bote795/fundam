//socketRequests
socket.on('connected', function (data) {
    redrawRooms(data.rooms);
    console.log(data.connectedRooms);
});
socket.on('playerJoinedGame', function (data) {
    console.log("the players name is "+ data.userName);
    $('#Number').text("Number of players:"+data.num);
    pplNumRoom=data.num;
    //if player equal to default you havent created a room
    //therfore you are player 2
    if (player==0) 
    {
        player=2;
    }
});

socket.on('newGameCreated', function (data) {
    console.log("the player created a new game named: "+ data.name);
    $('#Number').text("Number of players:"+1);
    pplNumRoom=1;
    //you have created a room therfore you are player 1
    player=1;
});
socket.on('newRoom', function (data) {
    if($('#Number').text()=="")
    {
        redrawRooms(data.rooms);
    }
});
socket.on('start', function (data) {
    console.log("start");
    $("#ready").toggle();
    game.state.start('Game');
    //MainGame.MainMenuState.prototype.start();
});
socket.on('playerMove', function (data) {
    console.log(data.userName);
    console.log(data);
    if (data.player+1 != player)
    {
        game.enemy.moveIndex=data.move;
        game.enemy.action = data.action;
        game.enemy.shoot = data.shoot;
        collisionManager()
    }
});
socket.on('error', function (data) {
    alert(data.message);
});

//helpers

$("#newRoom").submit(function (ev) {
    userName = $("#userName").text();
    var val = $("input:first").val();
    socket.emit("hostCreateNewGame", { name: val, userName: userName});
    ev.preventDefault();
    joinRoomUI(val);
});

//used to refresh html for rooms
function redrawRooms (rooms) {
    var $list = $("#roomNames");
    $list.empty();
        for (var key in rooms) {
             $list.append(roomNamesTemplate(key));
         }; 
    SelectRoom();
}
//html for rooms
function roomNamesTemplate (key) {
   return "<li> <a href='#selectRoom'>"+
        key
   +"</a></li>"; 
}
//function used to put listerners on a href to click
//to select a currentl existing room
function SelectRoom()
{
    $("a[href='#selectRoom']").on("click",function (event) {
        userName = $("#userName").text();
        socket.emit("playerJoinGame", { name: this.text, userName: userName});
        joinRoomUI(this.text);
    });
}

//hides text box and shows game

function joinRoomUI (name) 
{
    $('#roomNames').hide();
    $('#newRoom').hide();
    $('#phaser-example').toggle();
    $("#ready").toggle();
    var title = "\t room:" + name;
    roomName=name;
    $("#userName").append("<h2>"+title+"</h2>")
}

/*
    it will first check if the player has defend if not move on
        then move the players by setting there move field to true 
        and assigning where they have to move if not original player
    check if range or melee
    if melee then check if they are in same square 
        if so damage enemy 
        reset skills
    if range then check where they shot if hit
        if so damage enemy 
        reset skills
    reset timer
*/
function collisionManager () {
    var names=["player", "enemy"];
    /*
        Movement Phase
    */
    //check if they have defend if not move them
    for (var i = 0; i < names.length; i++) {
         if (game[names[i]].action !="defend")
        {
            game[names[i]].moveTo();
            console.log(names[i]);
        }
        else
        {
            game[names[i]].defend();
        }
    };
    /*
        Actions Beging Phase
        Melee
        Range
    */
    //melee attacks
    console.log("checking melee");
    for (var i = 0, x=0; i < names.length; i++) {
        if (i==0) 
            x=1;
        else
            x=0;
        if (game[names[i]].action =="melee")
        {
            console.log(game[names[i]].currentPosition);
            console.log(game[names[x]].currentPosition);
            console.log(game[names[i]].currentPosition == game[names[x]].currentPosition);

            if (game[names[i]].currentPosition == game[names[x]].currentPosition) 
            {
                game[names[x]]._damage(5);
                console.log(names[x]+" Got hurt melee by" +names[i]);
            };
        };
    };
    //range 
    for (var i = 0, x=0; i < names.length; i++) {
        if (i==0) 
            x=1;
        else
            x=0;
        if (game[names[i]].action =="range")
        {
            if (game[names[i]].shoot == game[names[x]].currentPosition) 
            {
                game[names[x]]._damage(5);
                console.log(names[x]+" Got hurt rnage");
            };
        };
    };
    //reset 
    console.log("reset");
   for (var i = 0; i < names.length; i++) {
        game[names[i]].reset();
    };

}