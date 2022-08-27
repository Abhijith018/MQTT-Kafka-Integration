

const { Kafka, logLevel } = require('kafkajs')



const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`abhijithuthaman:9092`],
  clientId: 'example-consumer',
})

const topic = 'topic_d'
const consumer = kafka.consumer({ groupId: 'topic_d_group' })

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
	  var dt2=Number(Date.now());
	  var msg=`${message.value}`;
	  msg=msg.toString();
	  var dt1=Number(msg.substr(msg.length - 13));
	  var diff= dt2-dt1;
	  console.log("Difference=="+diff);
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