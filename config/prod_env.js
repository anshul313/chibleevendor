/**
 * Expose
 */

module.exports = {
  logDir : '/var/log/api/', //@todo : check if log directory exits, if not create one.
  sessionSecret: "thisisareallylongandbigsecrettoken",
  mandrill:{
    key : 'euczZoWZFKwJoRHR5YvYaA'
  },
  amazon : {
    "accessKeyId": "AKIAJPFKQ6DYJVOHFFKA",
    "secretAccessKey": "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",
    "region":"ap-southeast-1"
  },
  mongo: {
    'db': 'quickly',
    'host': '128.199.116.241',
    'port': 12527,
    'username' : 'aarvee',
    'password' : 'aarvee@1234'
  }
};