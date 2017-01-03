declare const SparkMD5: any;
declare const md5chksum: any;
declare const require:(moduleId:string) => any;
let CryptoS3 = require('crypto-browserify/index.js');

export function calculateMD5Hash(file:any, successCB = (res:any)=>console.log(res), errorCB = (err:any)=>console.log(err)) {

  resolveLocalFileSystemURL(file, gotFile, errorCB);
            
  function gotFile(entry:any) {

    md5chksum.file(entry, ( md5:string ) => {

      let hexArray = md5
                    .replace(/\r|\n/g, "")
                    .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
                    .replace(/ +$/, "")
                    .split(" ");
      let byteString = String.fromCharCode.apply(null, hexArray);
      let base64string = btoa(byteString);
      successCB(base64string);

    }, errorCB);
  }

}
