var http = require('http');
var url = require('url');
var static_files = require('node-static');
var load_static_files = new(static_files.Server)();

//serve http and load static files (html, css, javascript, images etc)
var app = http.createServer(function (req, res) {
	load_static_files.serve(req, res);
	var url_request = url.parse(req.url).pathname;
}).listen(1111);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket){
	
	// when someone joined the playground
	socket.on('join_mover', function (name){		
		
		// to add the new player to other clients view
		socket.broadcast.emit('create_new_mover', name)
		
		// set the player_name as the name of the player
		socket.player_name = name;
		
		var players = [];
		
		//get all the players
		for(counter in io.sockets.clients())
		{
			players.push(io.sockets.clients()[counter].player_name);
		}
		
		// set the playground players and current player who joined
		playground = {players: players, current_player: name}
		
		// emit to the current player all the players of his/her view
		socket.emit('join_playground', playground)
	});
	
	// to broadcast the position of the moving player
	socket.on('my_position', function(position){
		console.log(position);
		socket.broadcast.emit('player_location', position);
	});
	
});

