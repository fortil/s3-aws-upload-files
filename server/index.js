var express = require('express'),
    crypto = require('crypto'),
    app = express(),
    bucket = "indata.dev1",
    secret = "1baH33ogR1vqYxAIWRxaRjqYEqnAGmjMpHDE2TA4",
    awsKey = "AKIAJCMEMX7CUIHHOWWQ";
 

 
function sign(req, res, next) {
    console.log(req.query)
    var fileName = req.query.name,
        expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
 
    var policy =
    { "expiration": expiration,
        "conditions": [
            {"bucket": bucket },
            {"key": "test/"+fileName},
            ["starts-with", "$key", "test/"],
            {"acl": 'public-read'},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 524288000]
        ]};
 
    var policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
    var signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64');
    res.json({bucket: bucket, awsKey: awsKey, policy: policyBase64, signature: signature});
 
}
 
// DON'T FORGET TO SECURE THIS ENDPOINT WITH APPROPRIATE AUTHENTICATION/AUTHORIZATION MECHANISM
app.get('/signing', sign);
 
app.listen(3000, function () {
    console.log('Server listening on port 3000');
});