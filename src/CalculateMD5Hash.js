"use strict";
var CryptoS3 = require('crypto-browserify/index.js');
function calculateMD5Hash(file, successCB, errorCB) {
    if (successCB === void 0) { successCB = function (res) { return console.log(res); }; }
    if (errorCB === void 0) { errorCB = function (err) { return console.log(err); }; }
    resolveLocalFileSystemURL(file, gotFile, errorCB);
    function gotFile(entry) {
        md5chksum.file(entry, function (md5) {
            var hexArray = md5
                .replace(/\r|\n/g, "")
                .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
                .replace(/ +$/, "")
                .split(" ");
            var byteString = String.fromCharCode.apply(null, hexArray);
            var toB64 = btoa(byteString);
            successCB({ toB64: toB64, md5: md5 });
        }, errorCB);
    }
}
exports.calculateMD5Hash = calculateMD5Hash;
