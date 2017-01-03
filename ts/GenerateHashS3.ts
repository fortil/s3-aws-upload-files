declare const Buffer: any;
declare const require:(moduleId:string) => any;
let CryptoS3 = require('crypto-browserify/index.js');
// let crypto = require('crypto-browserify/index.js');

// Genera los datos neesarios de S3
/*
* @Params
* bucket: el bucket de AWS S3
* secret: la llave secreta de AMAZON
* awsKey: la clave de AWS
*/
export class GenerateHashS3{
  bucket:string;
  secret:string;
  awsKey:string;

  constructor(bucket:string = "bucket", secret:string = "/HKbiTbg1",awsKey:string = ""){
    this.bucket = bucket;
    this.secret = secret;
    this.awsKey = awsKey;
  }
   
  generate( fileName:string, folder:string = "test/", md5:any, meta:any ) {
      // let expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
      let expiration = new Date(new Date("2020-10-29T22:55:11.186Z").getTime() + (1000 * 60 * 60 * 5)).toISOString();
   
      let policy =
      { "expiration": expiration,
        "conditions": [
            {"bucket": this.bucket },
            {"key": fileName},
            ["starts-with", "$key", folder],
            {"acl": 'public-read'},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 10485760],
        ]};
      if( md5 && md5 != false )
        policy.conditions.push(["starts-with", "$Content-MD5", ""]);
        policy.conditions.push(["starts-with", "$x-amz-meta-md5", ""]);
        policy.conditions.push(["starts-with", "$x-amz-meta-hash64", ""]);
      if( meta && meta != false){
        for (var i = 0, e = meta.length ; i < e; ++i) {
          policy.conditions.push(meta[i]);
        }
      }

      let policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
      let bucket = this.bucket;
      let awsKey = this.awsKey;
      let signature = CryptoS3.createHmac('sha1', this.secret).update(policyBase64).digest('base64');

      // retorna un objeto con las variables necesarias para enviar 
      // al servidor de S3
      return {bucket, awsKey, policyBase64, signature};
  }
  
}
