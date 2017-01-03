// Constructor de descargas
/*
* @Params
* fileName: Nombre del archivo
* url: Ruta de la cual se realizará la descarga
* Success calback: Función en la cual se retornará el resultado si todo ha sido exitoso
* Error calback: Función por la cual retornará si ha fallado alguno de los pasos
* Header - Opcional: Diccionario del cual si es necesario añadir cabeceras a las peticiones
* ----------------
* Notas:
* Por defetecto las funciones son console.log, si no se pasa ningún argumento.
* Si se desea realizar varias descargas a la vez, es mejor utilizar la clase
* pero con un setTimeout para cada petición.
*/
var S3Downloader = (function () {
    function S3Downloader(fileName, url, headers) {
        if (headers === void 0) { headers = null; }
        this.fileName = fileName;
        this.url = url;
        this.headers = headers;
    }
    S3Downloader.prototype.init = function (successCB, errorCB) {
        if (successCB === void 0) { successCB = function (res) { console.log(res); }; }
        if (errorCB === void 0) { errorCB = function (err) { console.log(err); }; }
        this.showIfAvailableLocal(this.fileName, this.url, successCB, errorCB, this.headers);
    };
    /*
    * Función para verificar si está habilitada la escritura del archivo a recibir
    */
    S3Downloader.prototype.showIfAvailableLocal = function (fileName, url, successCB, errorCB, headers) {
        var _this = this;
        /*
        * Se llama a la función requestFileSystem para realizar el proceso
        * de verificación de los archivos a descargar, desjar el espacio
        * para que no haya errores
        */
        requestFileSystem(LocalFileSystem.PERSISTENT, 5 * 1024 * 1024, function (fs) {
            // Make sure you add the domain name to the Content-Security-Policy <meta> element.
            // let url = 'http://cordova.apache.org/static/img/cordova_bot.png';
            // Parameters passed to getFile create a new file or return the file if it already exists.
            fs.root.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
                _this.downloadFileTransfer(fileEntry, url, successCB, errorCB, headers);
            }, errorCB);
        }, errorCB);
    };
    /*
    * Función que utiliza el FileTransfer para descargar los archivos con
    * cordova y no por medio de Ajax
    */
    S3Downloader.prototype.downloadFileTransfer = function (fileEntry, url, successCB, errorCB, headers) {
        var _this = this;
        var fileTransfer = new FileTransfer();
        var fileURL = fileEntry.toURL();
        var head = headers == null ? {} : headers;
        fileTransfer.download(url, fileURL, function (entry) {
            _this.getFileContentAsBase64(entry, successCB, errorCB);
        }, errorCB, null, // or, pass false
        head);
    };
    /*
    * En este paso se optiene el Base64 de la imagen y se devuelve
    * un objeto tanto con la codificación como con la ruta absoluta
    */
    S3Downloader.prototype.getFileContentAsBase64 = function (fileEntry, successCB, errorCB) {
        var url = fileEntry.toURL();
        resolveLocalFileSystemURL(url, gotFile, errorCB);
        function gotFile(entry) {
            entry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    var b64 = this.result;
                    successCB({ b64: b64, url: url });
                };
                reader.readAsDataURL(file);
            });
        }
    };
    return S3Downloader;
}());
window.S3Downloader = S3Downloader || {};
