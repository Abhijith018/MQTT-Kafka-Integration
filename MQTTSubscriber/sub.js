mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://broker.hivemq.com');
var i=0;
var j=0;
var nw=0;

client.on("connect",function(){
    client.subscribe('cranfield');
    console.log("Client has subscribed successfully");
});

client.on('message',function(topic,message){
	//console.log(Date.now());
	//var diff=Date.now()-message.toString();
    	
	
	if(i==0){
		  nw=Number(Date.now());
		  console.log("Now"+nw);
		  i=i+1;
		  j=j+1;
	  }
	  else{
		  var msg=message.toString();
	      var dt1=Number(msg.substr(msg.length - 13));
	      var diff= nw-dt1;
		  j=j+1;
		  console.log("Diff"+diff);
		  if( diff > 5000 ){
			console.log("5 Seconds completed>>>>>=="+j);
		  }
		  if( diff < 5000 ){
			console.log("5 Seconds completed<<<<<<>>>>>=="+j);
		  }
	  }
})