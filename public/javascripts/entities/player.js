function Player(game, spawn, player,currentPlayer, draw_coordinates) 
{
	this.game = game;
	//is this the current player? or enemy
	this.currentPlayer = currentPlayer;
	this.offset = new Phaser.Point(9, 12);
	//contains the points to move to
	this.draw_coordinates = draw_coordinates;
	//range, defend, melee
	this.action = null;

	this.shoot=null;

	this.health = 20;

	this.maxhealth = 20;

	//index of square currently on
	this.currentPosition=0;

	//player indicates if you are player 1
	//or player 2
	if (player == 1) 
	{
		this.skin = "characterN";
		this.currentPosition=0;
	}
	else
	{
		this.skin = "characterT";
		this.currentPosition=3;
	}
	this.midFiller =29;
	
	//possible 0-4 index to move to in draw_coordinates
	this.moveIndex=-1;
	//this will be used to move if true moves other wise doesnt move
	this.move =false;



	Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, this.skin);
     //adding health bar
 	this.healthBary = 36;

	this.healthBar = this.game.add.sprite(this.x, this.y + this.healthBary, 'health');
	this.healthBar.anchor.setTo(0, 0);

	//adding it to collision manager to take care of collisons
	//CollisionManager.addObjectToGroup(this, 'players');

	if(this.currentPlayer)
	{
		console.log(this.skin);
		this.shadow = this.game.add.sprite(this.x ,this.y + this.offset.y, this.skin);   
        this.shadow.anchor.set(0.5);
        this.shadow.tint = 0xff0000;
        this.shadow.alpha = 0.5;
	}
		//adds it to game and game calls update function automaticly 
	this.game.add.existing(this);
	
}
Player.prototype = Object.create( Phaser.Sprite.prototype );
Player.prototype.constructor = Player;
Player.prototype.update = function(){

	this.updateHealthBar();
	if(this.currentPlayer)
	{
		this.updateShadow();
	}
};
Player.prototype.attack = function(target){

};
Player.prototype.defend = function(){
	this.moveIndex=-1;
};

Player.prototype.updateHealthBar = function(){

	this.healthBar.x = this.x;
	this.healthBar.y = this.y + this.healthBary;

	var p = (this.health / this.maxhealth);
	p = parseFloat(p.toFixed(1));
	this.healthBar.frame = 10 - (p * 10);
};
Player.prototype.updateShadow = function(){

	this.shadow.x = this.x + this.offset.x;
    this.shadow.y = this.y + this.offset.y;
};
Player.prototype._damage = function(amount){
	if (this.action != "" && this.action!="defend") 
	{
		this.health -= amount;
		this.updateHealthBar();
	}
	if (this.health <= 0)
	{
		this.alive = false;
	};

	if (!this.alive) 
	{
		if(this.currentPlayer)
			this.shadow.destroy();
		this.healthBar.destroy();
		this.kill();
		this.die(true);
   	};
};
	
Player.prototype.die = function(points){
	this.game.state.start('GameOverState');
};
Player.prototype.reset = function(points){
	this.action = null;
	this.shoot = null;
	this.moveIndex = -1;
};

Player.prototype.moveTo = function () {
	var id = this.moveIndex;
	if (this.moveIndex == -1) {return;};
    this.x = this.draw_coordinates[id][0] + this.midFiller;
    this.y = this.draw_coordinates[id][1] + this.midFiller;
    this.currentPosition=id;
	this.move = false;
}