MainGame.MainMenuState = function(game){
	this.game = game;
};


MainGame.MainMenuState.prototype = {

	create: function(){	
      
		var width = 1024;
    	this.game.stage.backgroundColor = '#00FFFF';
	
      	var text = "Fundam";
		var style = {font: "30px Arial",
        fill: "#ff0044",
        align: "center"};


		var text= this.game.add.text(game.world.centerX, game.world.centerY, text, style);
		text.anchor.setTo(0.5,0.5);	

		this.game.add.button(game.world.centerX, game.world.centerY+100,
         'button', this.ready, this, null, 1);     
	},
	ready: function() {
		    socket.emit("ready",{userName: userName, room: roomName});
	},
	update: function(){

	}
};
