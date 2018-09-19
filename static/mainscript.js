var socket = io.connect('http://192.168.31.109:9000');
	var uErr=false ,pErr=false,emailErr=false;
socket.on('newQuestion',function(data){
		$("#msgSound")[0].play();
		location.reload();
});

socket.on('newAnswer',function(data){
	location.reload();
});


$(document).ready(function(){
	$(".upvote").click(function(event){
		$(this).attr("disabled", true);
		$(this).addClass("btn-success");
		var UpvoteForAid = $(this).attr("id");
		var update= "voteCount"+UpvoteForAid;
		var uname = $("#info").val();
		$.post("/updateVote", {aid: UpvoteForAid, uname:uname}, function(result){
			if(result=="success"){

				$("#"+update).text(function(i, origText){
					return (origText*1)+1;
				});
			}
		});
	});

	$("#formbtn").click(function(){
		var info =$("#info").val();
		var ques = $("#question").val();
		var data = {
			info:info,
			ques: ques,
		};
		socket.emit('newQuestion',data);
		$("#question").val("");
	});

	$("#submitAnswer").click(function(){
		var info =$("#info").val();
		var ans = $("#answer").val();
		var data = {
			info:info,
			ans: ans,
		};
		socket.emit('newAnswer',data);
		$("#answer").val("");
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

	$("#email").keyup(function(){
		var email = $("#email").val();
		var f_at_rate = /@/.test(email);
		var dot = /./.test(email);
		if(f_at_rate && dot) {
			emailErr=false;
			$("#email").removeClass("redAlert");
			$("#eError").css("display","none");
		}
		else{
		 	emailErr=true;
			$("#email").addClass("redAlert");
			$("#eError").css("display","inline");
		}
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

	if(uErr || pErr || emailErr) return false;
};
