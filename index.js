const mqtt = require('mqtt');
require('dotenv').config();

const clientId = 'mqttjs_' + Math.random().toString(8).substring(2, 4);
const client  = mqtt.connect(process.env.MQTT_BROKER, {clientId: clientId, clean: false, username: process.env.ACCESS_TOKEN});

const topicName = 'v1/devices/me/telemetry';

function generateData() {
    return {
        temperature: Number((Math.random() * 50).toFixed(1)),
        humidity: Number((Math.random() * 100).toFixed(1))
    };
}

client.on("connect",function(connack){
    console.log("client connected", connack);

    const publishData = () => {
        const payload = generateData();
        client.publish(topicName, JSON.stringify(payload), {qos: 1, retain: true}, (PacketCallback, err) => { 
    
            if(err) {
                console.log(err, 'MQTT publish packet');
            }
        });
    }

    setInterval(publishData, 60000);

    publishData();
});

client.on("error", function(err) { 
    console.log("Error: " + err) 
    if(err.code == "ENOTFOUND") { 
        console.log("Network error, make sure you have an active internet connection") 
    } 
});

client.on("close", function() { 
    console.log("Connection closed by client") 
});

client.on("reconnect", function() { 
    console.log("Client trying a reconnection") 
});

client.on("offline", function() { 
    console.log("Client is currently offline") 
});