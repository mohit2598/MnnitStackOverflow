var fnflag=0;
var lnflag=0;
var pflag=0;
var temp="";
uflag= 0;
function lncheck(value) {
	var s = value.search(/[0-9!@#$%^&* .]/);
	if(s>=0) { 
		document.getElementById("errln").innerHTML = "Name cannot contain digits";
		document.getElementById("lname").classList.add('redAlert');
		lnflag=1;
		}
	else  {
		document.getElementById("errln").innerHTML = '';
		document.getElementById("lname").classList.remove('redAlert');
		lnflag=0;
		}
}

function fncheck(value) {
	var s = value.search(/[0-9!@#$%^&* .]/);
	
	if(s>=0) {
		document.getElementById("errfn").innerHTML = "Name cannot contain digits";
		document.getElementById("fname").classList.add('redAlert');
		fnflag=1;
		}
	else  {
		document.getElementById("errfn").innerHTML = "";
		document.getElementById("fname").classList.remove('redAlert');
		fnflag=0;
		}
}
function uncheck(value) {
        if(value=="") {
			document.getElementById("username").classList.remove('redAlert');
			document.getElementById("errun").innerHTML = "";
		}
		else {
		var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
                document.getElementById("errun").innerHTML = this.responseText;
				temp = this.responseText;
				uflag= /taken/i.test(temp);
				if(uflag) {
					document.getElementById("username").classList.add('redAlert');
				}
				else {
					document.getElementById("username").classList.remove('redAlert');
				}
			}
        };
        xmlhttp.open("GET", "/project/check.php?q=" + value, true);
        xmlhttp.send();
		
}
}

function pascheck(value) {
	var pas = document.forms['form1']['password'].value;
	if(value!=pas) {
		document.getElementById("password2").classList.add('redAlert');
		document.getElementById("errpas").innerHTML = "Password does not match";
		pflag=1;
		}
	else {
		document.getElementById("errpas").innerHTML = "";
		pflag=0;
		document.getElementById("password2").classList.remove('redAlert');
		}
}

function validate2() {
	uflag= /taken/i.test(temp);
	if (lnflag==1) {
		return false;
	}
	if (fnflag==1) {
		return false;
	}
	if(pflag==1) {
		return false;
	}
	if(uflag) {
		
		return false;
	}
}


var lim = 20;
var to = 'iammohit';
function loadDoc(id,to) {
	var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		document.getElementById(id).innerHTML = this.responseText;
       }
    };
	xhttp.open("POST", "/project/refresh.php", true);
	xhttp.setRequestHeader( "Content-type" , "application/x-www-form-urlencoded");
	xhttp.send("limit=" + lim + "&to=" + to);
}


	

function scroll(id){
	var elem = document.getElementById(id);
	elem.scrollTop=elem.scrollHeight;
}
function pushmsg(id,to) {
	var xhttp = new XMLHttpRequest();
	var msg = document.getElementById(id).value;
	xhttp.open("POST" , "/project/update.php" ,true );
	xhttp.setRequestHeader( "Content-type" , "application/x-www-form-urlencoded");
	xhttp.send("msg=" + msg + "&to=" + to);
	document.getElementById(id).value='';
	
}
function identify(event,id,to) {
	var x = event.which;
	if (x==13) pushmsg(id,to);
}

function loadmore(){
   	lim += 20;
}
function showmsgbox() {
	alert(document.getElementById("collapseOne").style.display);
}
function chatperson(){
	var x=document.forms["formc"]["chatuser"].value;
	alert(x);
	return false;
}
var count = 0;
function myfunc(un,fn,ln) {
	if(count<5) {
	count=count+1;
	var colapid = "collapse"+count;
	var datatarget = '#' + colapid;
	var demo = "dem"+count;
	var messageid = "message"+count;
	var div1 = document.createElement("div");
	div1.setAttribute('class', 'chat-window');
	div1.setAttribute('id','chatbox'+count);
	var div2 = document.createElement("div");
	div2.setAttribute('class' , 'chat-user-name');
	var but1 = document.createElement("button");
	but1.setAttribute('class', 'btn btn-primary btn-block');
	but1.setAttribute('data-toggle' , 'colla');
	but1.setAttribute('data-target' , datatarget);
	var head = document.createTextNode(fn+ln);
	but1.appendChild(head);
	div2.appendChild(but1);
	div1.appendChild(div2);
	var div3 = document.createElement("div");
	div3.setAttribute('id', colapid);
	var div4 = document.createElement("div");
	div4.setAttribute('id', demo);
	div4.setAttribute('class', 'dem');
	div3.appendChild(div4);
	var div5 = document.createElement("div");
	div5.setAttribute('class', 'lowermsgbox');
	var inp1 = document.createElement('input');
	inp1.setAttribute('type','text');
	inp1.setAttribute('id', messageid);
	inp1.setAttribute('class', 'inpmsgbox');
	inp1.setAttribute('name','message');
	inp1.setAttribute('onkeyup' , 'identify(event,"'+messageid+'","'+un.trim()+'")');
	inp1.setAttribute('placeholder' , 'Type Your Message');
	div5.appendChild(inp1);
	var but2 = document.createElement("button");
	but2.setAttribute('class', 'btn btn-success btn-block');
	but2.setAttribute('onclick' , 'pushmsg("'+messageid+'","'+un.trim()+'")');
	var txt1 = document.createTextNode('Send');
	but2.appendChild(txt1);
	div5.appendChild(but2);
	div3.appendChild(div5);
	div1.appendChild(div3);
	document.getElementById('chat-space').appendChild(div1);
	window.setInterval(loadDoc,1000,demo,un.trim());
	scroll(un.trim());
	}
	
	
}