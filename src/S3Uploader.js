"use strict";
var GenerateHashS3_1 = require("./GenerateHashS3");
var CalculateMD5Hash_1 = require("./CalculateMD5Hash");
var GetMime_1 = require("./GetMime");
// Función de descargas
/*
* @Params
* imageUrl: Ruta de la imagen a subir, puede ser absoluta o en base64
* urlServer: Ruta del servidor a donde se sube
* Success calback: Función en la cual se retornará el resultado si todo ha sido exitoso
* Error calback: Función por la cual retornará si ha fallado alguno de los pasos
* Headers - Opcional: Diccionario del cual si es necesario añadir cabeceras a las peticiones
* ----------------
* Notas:
* Por defetecto las funciones son console.log, si no se pasa ningún argumento.
* Si se desea realizar varias descargas a la vez, es mejor utilizar la clase
* pero con un setTimeout para cada petición.
*/
function s3Uploader(conf, md5, successCB, errorCB) {
    if (successCB === void 0) { successCB = function (res) { console.log(res); }; }
    if (errorCB === void 0) { errorCB = function (err) { console.log(err); }; }
    CalculateMD5Hash_1.calculateMD5Hash(conf.filePath, function (hash) {
        // Genera los datos necesarios para S3
        var Hash = new GenerateHashS3_1.GenerateHashS3(conf.bucket, conf.secret, conf.awsKey);
        var data = Hash.generate(conf.folder + conf.fileName, conf.folder, (md5 && md5 == true) ? hash : false, (conf.meta && typeof conf.meta == 'object') ? conf.meta : false);
        // Para detectar el mime del archivo
        var mime = new GetMime_1.GetMime();
        var params = {
            "key": conf.folder + conf.fileName,
            "AWSAccessKeyId": data.awsKey,
            "acl": "public-read",
            "policy": data.policyBase64,
            "signature": data.signature,
            "Content-Type": mime.byExt(conf.fileName),
        };
        // Se añade el md5 del archivo, si existe
        if (md5 && md5 == true) {
            params["Content-MD5"] = hash.toB64;
            params["x-amz-meta-md5"] = hash.md5;
            params["x-amz-meta-hash64"] = hash.toB64;
        }
        // Se crea el objeto para aplicación opciones a FileTransfer
        var options = new FileUploadOptions();
        // Se define como campo "file" por defecto ya que en la 
        // mayoría de servidores se reciben los archivos con este key
        options.fileKey = "file";
        var fileName = params.key.split('/')[1];
        options.fileName = fileName;
        options.mimeType = params["Content-Type"];
        options.chunkedMode = false;
        options.httpMethod = 'POST';
        // Se codifica la url del servidor
        var uri = encodeURI(conf.urlServer);
        if (conf.headers) {
            var headKeys = Object.keys(conf.headers);
            for (var i = 0, l = headKeys.length; i < l; ++i) {
                params[headKeys[i]] = conf.headers[headKeys[i]];
            }
        }
        if (conf.meta) {
            options.meta = conf.meta;
        }
        // Se añaden todos los parámetros que llegan
        options.params = params;
        // Se crea el objeto FileTransfer y se le pasan las opciones
        var ft = new FileTransfer();
        ft.upload(conf.filePath, uri, successCB, errorCB, options);
    });
}
window.s3Uploader = s3Uploader || {};
