(function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            exports: {},
            id: moduleId,
            loaded: false
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.loaded = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.p = "";
    return __webpack_require__(0);
})([ function(module, exports) {
    var S3Downloader = function() {
        function S3Downloader(fileName, url, headers) {
            if (headers === void 0) {
                headers = null;
            }
            this.fileName = fileName;
            this.url = url;
            this.headers = headers;
        }
        S3Downloader.prototype.init = function(successCB, errorCB) {
            if (successCB === void 0) {
                successCB = function(res) {
                    console.log(res);
                };
            }
            if (errorCB === void 0) {
                errorCB = function(err) {
                    console.log(err);
                };
            }
            this.showIfAvailableLocal(this.fileName, this.url, successCB, errorCB, this.headers);
        };
        S3Downloader.prototype.showIfAvailableLocal = function(fileName, url, successCB, errorCB, headers) {
            var _this = this;
            requestFileSystem(LocalFileSystem.PERSISTENT, 5 * 1024 * 1024, function(fs) {
                fs.root.getFile(fileName, {
                    create: true,
                    exclusive: false
                }, function(fileEntry) {
                    _this.downloadFileTransfer(fileEntry, url, successCB, errorCB, headers);
                }, errorCB);
            }, errorCB);
        };
        S3Downloader.prototype.downloadFileTransfer = function(fileEntry, url, successCB, errorCB, headers) {
            var _this = this;
            var fileTransfer = new FileTransfer();
            var fileURL = fileEntry.toURL();
            var head = headers == null ? {} : headers;
            fileTransfer.download(url, fileURL, function(entry) {
                _this.getFileContentAsBase64(entry, successCB, errorCB);
            }, errorCB, null, head);
        };
        S3Downloader.prototype.getFileContentAsBase64 = function(fileEntry, successCB, errorCB) {
            var url = fileEntry.toURL();
            resolveLocalFileSystemURL(url, gotFile, errorCB);
            function gotFile(entry) {
                entry.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        var b64 = this.result;
                        successCB({
                            b64: b64,
                            url: url
                        });
                    };
                    reader.readAsDataURL(file);
                });
            }
        };
        return S3Downloader;
    }();
    window.S3Downloader = S3Downloader || {};
} ]);