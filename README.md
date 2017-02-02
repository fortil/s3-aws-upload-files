# Ejemplo de proyecto para la descarga y subida de archivos de S3 AWS con cordova (phonegap), con comprobación md5


## Plugins necesarios
```
$ cordova plugin add https://github.com/fastrde/phonegap-md5.git
$ cordova plugin add cordova-plugin-file-transfer
```

## Contenido

Los archivos <code>www/js/dist/S3Downloader.web.js</code> y <code>www/js/dist/S3Uploader.web.js</code> sirven para descargar y subir archivos respectivamente, estos son los precompilados para que corran en cualquier versión del webkit.

Los ejemplos de uso de los archivos están en <code>www/js/index.js</code>.

En la carpeta <code>ts/</code> se encuentra la versión para typescript

En la carpeta <code>src/</code> se encuentran los archivos .js


TODO
----
* Crear un método abreviado para las cabeceras extras de los archivos.