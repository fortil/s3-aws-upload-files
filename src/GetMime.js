"use strict";
// Una pequeña lista de mimes
/*
*
*/
var GetMime = (function () {
    function GetMime() {
        this.ext = {
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            jpe: 'image/jpeg',
            wav: 'audio/x-wav',
            mpeg: 'video/mpeg',
            mpe: 'video/mpeg',
            mpg: 'video/mpeg',
            amr: 'application/octet-stream',
            mp3: 'audio/mp3',
        };
        this.mime = {
            "image/png": 'png',
            "image/jpeg": 'jpg',
            "audio/x-wav": 'wav',
            "video/mpeg": 'mpeg ',
            "application/octet-stream": 'amr',
            "audio/mp3": 'mp3',
        };
    }
    /*
    * Recive el nombre del archivo y se devuelve el mimeType
    */
    GetMime.prototype.byExt = function (str) {
        var nameArr = str.split('.');
        var ext = nameArr[nameArr.length - 1];
        return this.ext[ext];
    };
    /*
    * Recive el mimeType y devuelve la extensión del archivo
    */
    GetMime.prototype.byMime = function (mime) {
        return this.mime[mime];
    };
    return GetMime;
}());
exports.GetMime = GetMime;
