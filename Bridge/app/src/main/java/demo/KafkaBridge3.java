package demo;

import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.util.Properties;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hivemq.client.mqtt.mqtt3.message.publish.Mqtt3Publish;

public class KafkaBridge3 {

	//private static final Logger log = LoggerFactory.getLogger(KafkaBridge1.class);
	private static int i = 0;
	private static KafkaProducer<String, String> producer = null;
	private static ProducerRecord<String, String> producerRecord = null;

	public void kafkaMethod(Mqtt3Publish publish) throws UnsupportedEncodingException {

		//log.info("Entering kafkaMethod");

		ByteBuffer buffer = ByteBuffer.wrap(publish.getPayloadAsBytes());

		String converted = new String(buffer.array(), "UTF-8");
		//log.info("Value111111111="+converted);
		String bootstrapServers = "127.0.0.1:9092";

		if (i == 0) {
			
			//log.info("Entering if condition");
			// create Producer properties
			Properties properties = new Properties();
			properties.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
			properties.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
			properties.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

			// create the producer
			producer = new KafkaProducer<>(properties);

			// create a producer record
			i = 1;
		}
		
		producerRecord = new ProducerRecord<>("topic_c", converted);

		// send data - asynchronous
		producer.send(producerRecord);

		// flush data - synchronous
		producer.flush();

		// flush and close producer
		// producer.close();

		//log.info("Exit kafkaMethod");

	}

}
