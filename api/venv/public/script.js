'use strict';


var order;

function sendTime(time) {
	order = document.getElementById('order').innerHTML;
	fetch('/respondWithTime/' + time + '/' + order)
		.then(res => getOrderString());
	
}


	
function getOrderString() {
	console.log('loop');
	fetch('/getOrderString')
    	.then(res => res.json())
    	.then(data => document.getElementById('order').innerHTML = data.order);		
}

$(document).ready(function(){
	getOrderString();
});