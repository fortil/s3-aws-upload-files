declare const LocalFileSystem: any
declare const resolveLocalFileSystemURL: any;
declare const requestFileSystem: any;
declare const FileTransfer: any;

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
class S3Downloader{
  fileName:string;
  url:string;
  headers:any;
  constructor(fileName:string, url:string, headers:any = null) {
    this.fileName = fileName;
    this.url = url;
    this.headers = headers;
  }
  init(successCB:any = (res:any) => { console.log(res) }, errorCB:any = (err:any) => { console.log(err) }){
    this.showIfAvailableLocal(this.fileName, this.url, successCB, errorCB, this.headers);
  }
  /*
  * Función para verificar si está habilitada la escritura del archivo a recibir
  */
  showIfAvailableLocal(fileName:string, url:string, successCB:any, errorCB:any, headers:any){
    /*
    * Se llama a la función requestFileSystem para realizar el proceso
    * de verificación de los archivos a descargar, desjar el espacio
    * para que no haya errores
    */
    requestFileSystem(LocalFileSystem.PERSISTENT, 5 * 1024 * 1024, (fs:any) => {
      // Make sure you add the domain name to the Content-Security-Policy <meta> element.
      // let url = 'http://cordova.apache.org/static/img/cordova_bot.png';
      // Parameters passed to getFile create a new file or return the file if it already exists.
      fs.root.getFile( fileName, { create: true, exclusive: false }, (fileEntry:any) => {
        this.downloadFileTransfer(fileEntry, url, successCB, errorCB, headers);

      }, errorCB );

    }, errorCB );
  }
  /*
  * Función que utiliza el FileTransfer para descargar los archivos con
  * cordova y no por medio de Ajax
  */
  downloadFileTransfer(fileEntry:any, url:string, successCB:any, errorCB:any, headers:any){

    let fileTransfer:any = new FileTransfer();
    let fileURL:any = fileEntry.toURL();
    let head:any = headers == null ? {} : headers;

    fileTransfer.download(
      url,
      fileURL,
      (entry:any) => {
        this.getFileContentAsBase64(entry, successCB, errorCB);
      },
      errorCB,
      null, // or, pass false
      head
    );

  }
  /*
  * En este paso se optiene el Base64 de la imagen y se devuelve
  * un objeto tanto con la codificación como con la ruta absoluta
  */
  getFileContentAsBase64( fileEntry:any, successCB:any, errorCB:any ){

    let url:any = fileEntry.toURL();
    resolveLocalFileSystemURL(url, gotFile, errorCB);
            
    function gotFile(entry:any) {
      entry.file(function(file:any) {

        let reader = new FileReader();

        reader.onloadend = function(e) {

          let b64:any = this.result;
          successCB( { b64, url });

        };
        reader.readAsDataURL(file);
      });
    }
  }
}

(<any>window).S3Downloader = S3Downloader || {};