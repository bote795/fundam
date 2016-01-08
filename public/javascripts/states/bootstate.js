var MainGame = {};

MainGame.BootState = function(game){

};

MainGame.BootState.prototype = {

	preload: function(){
		//load any assets needed for the LoaderState
      for( var i = 0; i < MainGame.resources.BootState.images.length; i++ ){
			var obj = MainGame.resources.BootState.images[i];
			this.game.load.image(obj.name, obj.path);
		}
      
		for( var i = 0; i < MainGame.resources.BootState.spritesheets.length; i++ ){
			var obj = MainGame.resources.BootState.spritesheets[i];
			this.game.load.spritesheet(obj.name, obj.path, obj.width, obj.height);
		}

	},

	create: function(){

		this.game.state.start('Loader');
	}
};