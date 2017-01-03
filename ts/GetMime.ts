// Una pequeña lista de mimes
/*
* 
*/
export class GetMime {
  ext:any = {
    png:'image/png',
    jpg:'image/jpeg',
    jpeg:'image/jpeg',
    jpe:'image/jpeg',
    wav:'audio/x-wav',
    mpeg :'video/mpeg',
    mpe:'video/mpeg',
    mpg:'video/mpeg',
    amr:'application/octet-stream',
    mp3:'audio/mp3',
  }
  mime:any = {
    "image/png": 'png',
    "image/jpeg": 'jpg',
    "audio/x-wav": 'wav',
    "video/mpeg": 'mpeg ',
    "application/octet-stream": 'amr',
    "audio/mp3": 'mp3',
  }
  constructor(){
  }
  /*
  * Recive el nombre del archivo y se devuelve el mimeType
  */
  byExt(str:string){
    let nameArr = str.split('.');
    let ext = nameArr[ nameArr.length - 1 ];
    return this.ext[ext];
  }
  /*
  * Recive el mimeType y devuelve la extensión del archivo
  */
  byMime(mime:string){
    return this.mime[mime];
  }
}
