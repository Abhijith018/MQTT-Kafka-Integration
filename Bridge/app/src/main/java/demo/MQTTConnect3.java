package demo;

import java.io.UnsupportedEncodingException;
import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hivemq.client.mqtt.MqttClient;
import com.hivemq.client.mqtt.mqtt3.Mqtt3AsyncClient;

public class MQTTConnect3 extends Thread {

	private static final Logger log = LoggerFactory.getLogger(MQTTConnect2.class);

	public void run() {

		// log.info("Entering connectToMQTT");

		KafkaBridge3 kafkaBridge = new KafkaBridge3();
		Mqtt3AsyncClient client = MqttClient.builder().useMqttVersion3().serverHost("broker.hivemq.com").buildAsync();

		client.connectWith().send().whenComplete((connAck, throwable) -> {
			if (throwable != null) {
				log.info("Connection Failed");
				log.info(throwable.getMessage());
			} else {
				client.subscribeWith().topicFilter("cranfield3").callback(publish -> {
					// log.info("Successfully connected with the topic");
					try {
						kafkaBridge.kafkaMethod(publish);
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					}
				}).send();

			}

		});

		// log.info("Exit connectToMQTT");
	}
}
