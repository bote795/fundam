 var ip="10.201.136.178";
 var socket = io.connect(ip+':3000');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });