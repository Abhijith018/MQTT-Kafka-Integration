

const { Kafka, logLevel } = require('kafkajs')



const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`abhijithuthaman:9092`],
  clientId: 'example-consumer',
})

const topic = 'topic_a'
const consumer = kafka.consumer({ groupId: 'topic_a_group' })
var i=0;
var j=0;
var nw=0;

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachBatch: async ({ batch }) => {
       console.log(batch)
    },
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
	  //var diff=Date.now().toString()-message.toString();
	  //console.log(diff);
	  //console.log("Printing>>>>>>>")
      //console.log(`- ${prefix} ${message.key}#${message.value}`)
	  if(i==0){
		  nw=Number(Date.now());
		  j=j+1;
	  }
	  else{
		  var msg=`${message.value}`;
		  msg=msg.toString();
	      var dt1=Number(msg.substr(msg.length - 13));
	      var diff= nw-dt1;
		  j=j+1;
		  if(diff>5000){
			console.log("5 Seconds completed>>>>>=="+j);
		  }
	  }
	  //var dt2=Number(Date.now());
	  //var msg=`${message.value}`;
	  //msg=msg.toString();
	  //var dt1=Number(msg.substr(msg.length - 13));
	  //var diff= dt2-dt1;
	  //console.log("Difference=="+diff);
    },
  })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})