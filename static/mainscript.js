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
			success: function(result){
				location.reload();
			}
		});
		fname.val("");
		lname.val("");
		msg.val("");
	});
});
