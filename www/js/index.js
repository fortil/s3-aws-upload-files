'use strict';

function displayImageByFileURL( src ) {
  var elem = document.getElementById('imagen');
  elem.src = src;
}


document.addEventListener('deviceready', function(){
  // Url de la imagen a descargar
  var urlDownload = 'http://cdn.inmotionhosting.com/support/images/stories/wordpress-plugins/ithemes-security-hide-url-1.png';
  // nombre del archivo generado aleatoriamente que se le dará a la descarga
  var fileName = 'ARCHIVO_DE_PRUEBA.png';
  // Imagen que se descarga después de darclick en el botón de descarga
  var ImagenDownloaded = null;


  document.getElementById('downloadImg').addEventListener('click', function(){
    
    var descarga = new S3Downloader(fileName, urlDownload);
    descarga.init(function( image ){

      ImagenDownloaded = image;
      displayImageByFileURL( image.url );

    })

  })


  document.getElementById('uploadImg').addEventListener('click',function(){
    var urlTempImg = ImagenDownloaded.url

    /*
    * Params
    * s3Uploader(conf, ifMd5, successCallback, errorCallback)
    * @conf es la configuración del servidor, como la Url de la imagen (dónde se encuentra la imagen a subir)
    * * bucket: es el nombre del bucket
    * * awsKey: es la key de AWS
    * * secret: es la llave secreta de AWS
    * * folder: es la carpeta donde se subirán los archivos ej; test/ (con barra al final)
    * * fileName: es el nombre del archivo archivo_ejemplo.txt
    * * urlServer: es la url completa de AWS dónde se subirán los archivos ej: 'http://'+Bucket+'.s3.amazonaws.com/'
    * * headers: es opcional
    * @ifMd5, si requiere que el servidor haga la comprobación del md5 del archivo
    */
    s3Uploader(
      {
        filePath: urlTempImg,
        bucket: Bucket,
        awsKey: awsKey,
        secret: secret,
        folder: Folder,
        fileName: fileName,
        urlServer: urlAWS,
      },
      true
    )
  })

}, false);





// 
// Opción por si el policy se quiere dejar en el servidor
// 
// var xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
//   if (this.readyState == 4 && this.status == 200) {
//     var data = JSON.parse(this.response);
//     S3Uploader( image64, //'file:///storage/emulated/0/downloaded-image.png', 
//       'http://indata.dev1.s3.amazonaws.com/', 
//       {
//         "key": "test/"+fileName,
//         "AWSAccessKeyId": data.awsKey,
//         "acl": "public-read",
//         "policy": data.policy,
//         "signature": data.signature,
//         "Content-Type": "image/png"
//       },
//       function ( e ) {
//         console.log( e )
//     })
//   }
// };
// xhttp.open("GET", urlServer+'?name='+fileName, true);
// xhttp.send();