var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });
var squareSize= 90; 
function preload() {

    game.load.spritesheet('button', '/images/number-buttons-90x90.png', squareSize, squareSize);
    game.load.spritesheet('character', '/images/spritesheets/ninja.png', 36, 36);
    game.load.spritesheet('health', '/images/spritesheets/player_health.png', 48, 6);
}

var button=[];
var background;
var draw_coordinates= [[0,0], [0,squareSize], [squareSize,0], [squareSize,squareSize]]
var character;
var midFiller =29;
var text;
var timer_count=10;
var message="Choose your move:";
var moveTo=-1;
function create() {

    game.stage.backgroundColor = '#00FFFF';
    for (var i = 0; i < draw_coordinates.length; i++) {
        button.push(game.add.button(draw_coordinates[i][0], draw_coordinates[i][1],
         'button', actionOnClick, i, null, i));
        button[i].id=i;
    };
    character = game.add.sprite(draw_coordinates[0][0]+midFiller,
        draw_coordinates[0][1]+midFiller,'character')
    
    text = game.add.text(game.world.centerX+100, game.world.centerY-250,
        message, {
        font: "30px Arial",
        fill: "#ff0044",
        align: "center"
    });
    text.anchor.setTo(0.5,0.5)
    timer = game.time.events.loop(Phaser.Timer.SECOND, updateTimer);
}

function actionOnClick () {
    moveTo = arguments[0].id;
}

function move(id)
{
    character.x = draw_coordinates[id][0]+midFiller;
    character.y = draw_coordinates[id][1]+midFiller;
}

function updateTimer() {
    timer_count -=1;
    text.setText(message+timer_count);

    if(timer_count <= 0 )
    {
        game.time.events.stop(timer);
        text.setText("Finished");
        if (moveTo != -1) 
        {
            move(moveTo);
        }

    }
}