 var ip="10.201.136.178";
 //ip="192.168.1.25";
 var socket = io.connect(ip+':3000');
 var player=0;
 var pplNumRoom=0;
 var userName;
 var roomName;
//socket requests 
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
    addCharacter();
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
    reset();
});
socket.on('playerMove', function (data) {
    //socket.emit("playerMove", { move: moveTo, userName: userName});
    console.log(data.userName);
    move(data.player,data.move);
});
socket.on('error', function (data) {
    alert(data.message);
});

//helpers

$('#ready').click(function () {
    socket.emit("ready",{userName: userName, room: roomName});
});
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

//game data

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });
var squareSize= 90; 
var timerBase = 10;
var moveBase = -1;
function preload() {

    game.load.spritesheet('button', '/images/number-buttons-90x90.png', squareSize, squareSize);
    game.load.spritesheet('characterN', '/images/spritesheets/ninja.png', 36, 36);
    game.load.spritesheet('characterT', '/images/spritesheets/tank.png', 36, 36);
    game.load.spritesheet('health', '/images/spritesheets/player_health.png', 48, 6);
}

//array of four buttons to move to
var button=[];
//coordinates of where the squarestop left corner is
var draw_coordinates= [[0,0], [0,squareSize], [squareSize,0], [squareSize,squareSize]]
//will keep players
//index 0, will be player 1, index 1 player 2
var character=[];
var midFiller =29;
var text;
var timer_count=timerBase;
var message="Choose your move:";
//moveTo which is a variable to keep track if a square was pressed
var moveTo=moveBase;
//will keep which sprite to load on who
//index 0, will be player 1, index 1 player 2
var loadout=[];
var offset = new Phaser.Point(9, 12);
var shadow;
var actions=[melee,range,defend];
function create() {

    game.stage.backgroundColor = '#00FFFF';
    for (var i = 0; i < draw_coordinates.length; i++) {
        button.push(game.add.button(draw_coordinates[i][0], draw_coordinates[i][1],
         'button', actionOnClick, i, null, i));
        button[i].id=i;
    };
    for (var i = 1; i < actions.length+1; i++) {
        button.push(game.add.button(i*100, 200,
         'button', actions[i-1], this, null, 1));
        
    };
    loadout.push("characterN");
    loadout.push("characterT");


    character.push( game.add.sprite(draw_coordinates[0][0]+midFiller,
        draw_coordinates[0][1]+midFiller,loadout[0]));
    addCharacter();
    text = game.add.text(game.world.centerX+100, game.world.centerY-250,
        message+timerBase, {
        font: "30px Arial",
        fill: "#ff0044",
        align: "center"
    });
    text.anchor.setTo(0.5,0.5);
    //player x
    game.add.text(game.world.centerX+100, game.world.centerY-300,
    "Player"+player, {
    font: "30px Arial",
    fill: "#ff0044",
    align: "center"
    });
    text.anchor.setTo(0.5,0.5)
    game.add.text(game.world.centerX+100, game.world.centerY-200,
    "Todo", {
    font: "30px Arial",
    fill: "#ff0044",
    align: "center"
    });
    text.anchor.setTo(0.5,0.5)
}
//adds second player when second player joins lobby
function addCharacter()
{
    if(pplNumRoom ==2 && character.length <= 1)
    {
        character.push( game.add.sprite(draw_coordinates[3][0]+midFiller,
        draw_coordinates[3][1]+midFiller,loadout[1])); 
        //shadow for player
        shadow = game.add.sprite(character[player-1].x + offset.x,character[player-1].y + offset.y,character[player-1].key);   
        shadow.anchor.set(0.5);
        shadow.tint = 0xff0000;
        shadow.alpha = 0.5;
    }
}
//saves the id of clicked square of where to move
function actionOnClick () {
    moveTo = arguments[0].id;
}
//moves player to x,y
//@params pl = player id of which to move
//@param id = id of which square to move to
function move(pl,id)
{
    character[pl].x = draw_coordinates[id][0]+midFiller;
    character[pl].y = draw_coordinates[id][1]+midFiller;

    if (pl == player-1)
    {
        shadow.x = character[pl].x + offset.x;
        shadow.y = character[pl].y + offset.y;
    };
}
//function to update how many seconds left
//and when time is over sends movement data
function updateTimer() {
    timer_count -=1;
    text.setText(message+timer_count);

    if(timer_count <= 0 )
    {
        clearInterval(timer);
        text.setText("Finished");
        timer_count = timerBase; 
        if (moveTo != moveBase) 
        {
            socket.emit("playerMove", { player: player-1,move: moveTo, userName: userName, room: roomName});
        }
        reset();
    }
}
//function to reset time interval 
//and moveTo which is a variable to keep track if a square was pressed
function reset(){
    timer = setInterval(updateTimer, 1000);
    moveTo = moveBase;

}
function melee()
{
    console.log("melee");
}
function range()
{
    console.log("range");
}
function defend()
{
    console.log("defend");
}