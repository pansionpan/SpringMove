window.onload = function(){
	var re = document.getElementById("reset");
	var re2 = document.getElementById("resett");
	var re3 = document.getElementById("resettt");
	var re4 = document.getElementById("resetttt");
	var div1= document.getElementById("div1");
	re.onclick = function(){
		div1.style.left = 10 + 'px';
	}
	
	re2.onclick = function(){
		div2.style.left = 10 + 'px';
	}
	
	re3.onclick = function(){
		div3.style.left = 10 + 'px';
	}
	
	re4.onclick = function(){
		div3.style.left = 10 + 'px';
		div1.style.left = 10 + 'px';
		div2.style.left = 10 + 'px';
	}

}
