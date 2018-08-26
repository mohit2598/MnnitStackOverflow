var socket = io.connect('http://192.168.31.109:9000');

socket.on('newPost',function(data){
		var update= "<li><h2>"+data.fn+" "+data.ln+"</h2><p>"+data.ms+"</p></li>"
		$("#pa").append(update);
		$("#msgSound")[0].play();
});

$(document).ready(function(){
	$("#formbtn").click(function(){
		var fname= $("#fname");
		var lname = $("#lname");
		var msg = $("#message");
		var data = {
			fn: fname.val(),
			ln: lname.val(),
			ms: msg.val()
		};
		$.ajax({
			type:'POST',
			url:'/filemaintainer',
			data: data,
		});
		socket.emit('newPost',data);
		fname.val("");
		lname.val("");
		msg.val("");
	});
});
