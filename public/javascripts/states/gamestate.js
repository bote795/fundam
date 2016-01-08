MainGame.GameState = function(game){
	this.game = game;
};

MainGame.GameState.prototype = {

	create: function(){
		const squareSize= 90; 
		var button=[];
		var midFiller =29;
		var style ={
        font: "30px Arial",
        fill: "#ff0044",
        align: "center"
    	};

		var message="Choose your move:";

      	var draw_coordinates= [[0,0], [0,squareSize], [squareSize,0], [squareSize,squareSize]];
		
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.stage.backgroundColor = '#00FFFF';

		var actions=[this.melee,this.range,this.defend];

	    for (var i = 0; i < draw_coordinates.length; i++) {
	        button.push(this.game.add.button(draw_coordinates[i][0], draw_coordinates[i][1],
	         'button', this.actionOnClick, this, null, i));
	        button[i].id=i;
	    };
	    for (var i = 1; i < actions.length+1; i++) {
	        button.push(this.game.add.button(i*100, 200,
	         'button', actions[i-1], this, null, 1));
	        
	    };
	    if (player ==1 ) 
	    {
			this.game.player = new Player(this.game, 
				{x:draw_coordinates[0][0]+midFiller, 
				y:draw_coordinates[0][1]+midFiller},
				 1, true, draw_coordinates  ); 	    	
			this.game.enemy = new Player(this.game, 
				{x:draw_coordinates[3][0]+midFiller, 
				y:draw_coordinates[3][1]+midFiller},
				 2, false, draw_coordinates  ); 
	    }
	   	else
	    {
			this.game.enemy = new Player(this.game, 
				{x:draw_coordinates[0][0]+midFiller, 
				y:draw_coordinates[0][1]+midFiller},
				 1, false, draw_coordinates  ); 	    	
			this.game.player = new Player(this.game, 
				{x:draw_coordinates[3][0]+midFiller, 
				y:draw_coordinates[3][1]+midFiller},
				 2, true, draw_coordinates  ); 
	    }
			
		//text
	    Manage.texts.push(game.add.text(game.world.centerX+100, game.world.centerY-250,
        message+this.timerBase, style));
    	Manage.texts[0].anchor.setTo(0.5,0.5);

	    //player x
	    game.add.text(game.world.centerX+100, game.world.centerY-300,
	    "Player: "+player, style);
	    Manage.texts.push(game.add.text(game.world.centerX, game.world.centerY,
	    "", style));
	    Manage.texts.push(game.add.text(game.world.centerX, game.world.centerY+50,
	    "Movement: ", style));
	    Manage.texts.push(game.add.text(game.world.centerX, game.world.centerY+100,
	    "Action: ", style));	    
		Manage.reset();	
	},

	update: function(){
	},

	render: function(){
	},

	actionOnClick: function () {
		//id of clicked button
		var id = arguments[0].id;
		if(this.game.player.action=="range")
			this.game.player.shoot = id;
		else
			this.game.player.moveIndex= id;
		Manage.texts[2].setText("Movement: "+(id+1));
	},
	melee: function () {
    	console.log("melee");
    	this.game.player.action = "melee";
    	Manage.texts[3].setText("melee");
    	this.clearShoot;
	},
	range: function () {
    	console.log("range");
		this.game.player.action = "range";
		Manage.texts[1].setText("Choose where to shoot");
		Manage.texts[3].setText("range");
		this.clearShoot;
	},

	defend: function () {
    	console.log("defend");
    	this.game.player.action = "defend";
    	Manage.texts[3].setText("defend");
		this.clearShoot;
	},
	clearShoot: function(){
		Manage.texts[1].setText("");
	}

};