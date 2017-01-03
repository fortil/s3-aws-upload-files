"use strict";
var CryptoS3 = require('crypto-browserify/index.js');
// let crypto = require('crypto-browserify/index.js');
// Genera los datos neesarios de S3
/*
* @Params
* bucket: el bucket de AWS S3
* secret: la llave secreta de AMAZON
* awsKey: la clave de AWS
*/
var GenerateHashS3 = (function () {
    function GenerateHashS3(bucket, secret, awsKey) {
        if (bucket === void 0) { bucket = "bucket"; }
        if (secret === void 0) { secret = "/HKbiTbg1"; }
        if (awsKey === void 0) { awsKey = ""; }
        this.bucket = bucket;
        this.secret = secret;
        this.awsKey = awsKey;
    }
    GenerateHashS3.prototype.generate = function (fileName, folder, md5, meta) {
        if (folder === void 0) { folder = "test/"; }
        // let expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
        var expiration = new Date(new Date("2020-10-29T22:55:11.186Z").getTime() + (1000 * 60 * 60 * 5)).toISOString();
        var policy = { "expiration": expiration,
            "conditions": [
                { "bucket": this.bucket },
                { "key": fileName },
                ["starts-with", "$key", folder],
                { "acl": 'public-read' },
                ["starts-with", "$Content-Type", ""],
                ["content-length-range", 0, 10485760]
            ] };
        if (md5 && md5 != false)
            policy.conditions.push(["starts-with", "$Content-MD5", ""]);
        if (meta && meta != false) {
            for (var i = 0, e = meta.length; i < e; ++i) {
                policy.conditions.push(meta[i]);
            }
        }
        console.log('GenerateHashS3 policy: ', policy);
        var policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
        var bucket = this.bucket;
        var awsKey = this.awsKey;
        var signature = CryptoS3.createHmac('sha1', this.secret).update(policyBase64).digest('base64');
        // retorna un objeto con las variables necesarias para enviar 
        // al servidor de S3
        return { bucket: bucket, awsKey: awsKey, policyBase64: policyBase64, signature: signature };
    };
    return GenerateHashS3;
}());
exports.GenerateHashS3 = GenerateHashS3;
