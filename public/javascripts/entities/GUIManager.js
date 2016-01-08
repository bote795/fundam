function GUIManager(){
	this.texts=[];
	this.timer_count= 10;
	this.timer;
}

//function to update how many seconds left
//and when time is over sends movement data
GUIManager.prototype.updateTimer = function() {
	var text = this.texts[0];
	var message="Choose your move:";
    this.timer_count -=1;
    text.setText(message+ this.timer_count);

    if(this.timer_count <= 0 )
    {
        clearInterval(this.timer);
        text.setText("Turn Ended");
        this.texts[1].setText("");
        this.texts[2].setText("Movement: ");
        this.texts[3].setText("Action: ");
        this.timer_count = 10; 

            socket.emit("playerMove", 
            { player: player-1, 
            	move: game.player.moveIndex,
            	userName: userName,
            	action: game.player.action,
            	shoot: game.player.shoot,
             room: roomName});
        if (game.player.alive && game.player.alive)
        {
        	this.reset();
        };

    }
};

GUIManager.prototype.reset =function(){
	var layer=this;
    this.timer = setInterval(
    	this.updateTimer.bind(this)
    , 1000);
};  