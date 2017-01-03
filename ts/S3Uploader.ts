import { GenerateHashS3 } from './GenerateHashS3';
import { calculateMD5Hash } from './CalculateMD5Hash';
import { GetMime } from './GetMime';
declare const FileUploadOptions: any;
declare const FileTransfer: any;


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

function s3Uploader(conf:any, md5:boolean, successCB:any = (res:any) => { console.log(res) }, errorCB:any = (err:any) => { console.log(err) }) {
  calculateMD5Hash(conf.imageUrl, function( hashMD5 ){
    
     // Genera los datos necesarios para S3
    let Hash = new GenerateHashS3( conf.bucket, conf.secret, conf.awsKey );
    let data = Hash.generate( conf.folder+conf.fileName, conf.folder, (md5 && md5 == true) ? hashMD5 : false );
    // Para detectar el mime del archivo
    let mime = new GetMime();

    let params:any = {
      "key": conf.folder+conf.fileName,
      "AWSAccessKeyId": data.awsKey,
      "acl": "public-read",
      "policy": data.policyBase64,
      "signature": data.signature,
      "Content-Type": mime.byExt(conf.fileName),
      // "enable_content_md5": "enable",
    }

    if(md5 && md5 == true){
      params["Content-MD5"] = hashMD5;
      // params["headers"] = {
      //   "md5chksum": hashMD5
      // }
    }

    
    // Se crea el objeto para aplicación opciones a FileTransfer
    let options = new FileUploadOptions();
    // Se define como campo "file" por defecto ya que en la 
    // mayoría de servidores se reciben los archivos con este key
    options.fileKey = "file";
    let fileName = params.key.split('/')[1];

    options.fileName = fileName;
    options.mimeType = params["Content-Type"];
    options.chunkedMode = false;
    options.httpMethod = 'POST';
    // Se codifica la url del servidor
    let uri = encodeURI(conf.urlServer);
    // if (params["Content-MD5"]) {
    //   if(options.headers || options.headers==null)
    //     options.headers = {}

    //   options.headers["Content-MD5"] = params["Content-MD5"];
    //   delete params["Content-MD5"];
    // }
    if( conf.headers ){
      let headers = conf.headers;
      options.headers = headers;
      delete params.headers
    }

    // Se añaden todos los parámetros que llegan
    options.params = params;
    // Se crea el objeto FileTransfer y se le pasan las opciones
    let ft = new FileTransfer();
    ft.upload(conf.filePath, uri, successCB, errorCB, options);
    

  })



}
(<any>window).s3Uploader = s3Uploader || {};