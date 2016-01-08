MainGame.GameOverState = function(game){

};

MainGame.GameOverState.prototype = {

	create: function(){
		var width = 1024;
				var style ={
        font: "30px Arial",
        fill: "#ff0044",
        align: "center"
    	};
 	    this.game.stage.backgroundColor = '#000';
 	    var message;
 	    if (game.player.alive)
 	    {
 	    	message ="YOU WON!";
 	    }
 	    else
 	    	message= "You LOST :(";
 	    this.game.add.text(game.world.centerX, game.world.centerY+100,
	    message, style);

	},

	update: function(){

	}
};