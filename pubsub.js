const redis = require('redis');

const CHANNEL = {

    TEST : 'TEST',

    BLOCKCHAIN : 'BLOCKCHAIN'

};

class PubSub {

    constructor ( {blockchain} ) {

        this.blockchain = blockchain;

        this.publisher = redis.createClient();

        this.subscriber = redis.createClient();

        this.subscribeTochannels();

        this.subscriber.on('message',(channel ,message)=> this.handleMesssage(channel,message));

    }

    handleMesssage(channel,message) {

        console.log('message recieved. Channel: '+channel+' message '+message);

        const parsedMessage = JSON.parse(message);

        if(channel === CHANNEL.BLOCKCHAIN){
            this.blockchain.replacechain(parsedMessage);
        }
    }

    subscribeTochannels(){
        Object.values(CHANNEL).forEach(channel =>{
            this.subscriber.subscribe(channel);
        });
    }

    publish({ channel , message}){
        this.publisher.publish(channel,message);
    }

    broadcastChain(){
        this.publish({
            channel : CHANNEL.BLOCKCHAIN,
            message : JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;