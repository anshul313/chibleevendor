/**
 * Expose
 */

module.exports = {
	db:'mongodb://' + (process.env.MONGODB_PORT_27017_TCP_ADDR || 'localhost') + '/ap_test',
  logDir : './logs/', //@todo : check if log directory exits, if not create one.
  sessionSecret: "thisisareallylongandbigsecrettoken",
  amazon : {
  	"accessKeyId": process.env.AMAZON_KEY,
  	"secretAccessKey": process.env.AMAZON_SECRET,
  	"region":process.env.AMAZON_REGION
  },
    mongo: {
        'db': 'quickly',
        'host': '128.199.116.241',
        'port': 12527,
        'username' : 'aarvee',
        'password' : 'aarvee@1234'
    }
};