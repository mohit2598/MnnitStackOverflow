var socket = io.connect('http://192.168.31.109:9000');
	var uErr=false ,pErr=false;
socket.on('newPost',function(data){
		var update= "<li><h2 class='question-heading'><a href='question/"+data.id+"'><strong>Question: </strong>"+data.ms+"</a></h2><p><strong>By: </strong><a class='author' href='profile/"+data.un+"' >"+data.un+"</a></p></li>";
		$("#pa").append(update);
		$("#msgSound")[0].play();
});



$(document).ready(function(){
	$("#formbtn").click(function(){
		var fn =$("#fname").val();
		var ln = $("#lname").val();
		var un = $("#uname").val();
		var ms = $("#message").val();
		var data = {
			fn: fn ,
			ln: ln ,
			un: un ,
			ms: ms,
		};
		socket.emit('newPost',data);
		$("#message").val("");
	});

	$("#openmsg").trigger("click");

	$("#username").keyup(function(){
			var txt = $("#username").val();
			$.post("/checkUsername", {username: txt}, function(result){
					if(result=="taken"){
						$("#username").addClass("redAlert");
						$("#unError").css({"display":"inline"});
						uErr=true;
					}
					else{
						$("#username").removeClass("redAlert");
						$("#unError").css("display","none");
						uErr=false;
					}
			},"text");
	});


});


function validation(){
		if($("#password").val()==$("#password2").val()){
			$("#password2").removeClass("redAlert");
			$("#cpError").css("display","none");
			pErr=false;
		}
		else{
			$("#password2").addClass("redAlert");
			$("#cpError").css("display","inline");
			 pErr=true;
		 }
	if(uErr || pErr) return false;
};
