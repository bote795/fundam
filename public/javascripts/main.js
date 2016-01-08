var width  = 800;
var height = 600;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'phaser-example');

game.state.add('Boot', MainGame.BootState);
game.state.add('Loader', MainGame.LoaderState);
game.state.add('MainMenu', MainGame.MainMenuState);
game.state.add('Game', MainGame.GameState);
game.state.add('GameOverState', MainGame.GameOverState);

game.state.start('Boot');
window.game = game;