mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://broker.hivemq.com');

client.on("connect",function(){
    client.subscribe('cranfield5');
    console.log("Client has subscribed successfully");
});

client.on('message',function(topic,message){
	//console.log(Date.now());
	//var diff=Date.now()-message.toString();
    	
	var dt2=Number(Date.now());
	var msg=message.toString();
	var dt1=Number(msg.substr(msg.length - 13));
	var diff= dt2-dt1;
	console.log("Difference=="+diff);
})