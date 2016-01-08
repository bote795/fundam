 var ip="10.201.136.178";
 ip="192.168.1.25";
 var socket = io.connect(ip+':3000');
 var player=0; //says what player you are
 var pplNumRoom=0;
 var userName;
 var roomName;
 //holdes GUI elements and numbers needed in game
 var Manage = new GUIManager();