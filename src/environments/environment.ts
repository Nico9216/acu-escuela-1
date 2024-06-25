// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //url_ws: 'http://192.1.0.86:80/ACUWS_EscuelaConduccionACUProd/rest',
  url_ws: 'http://192.1.0.86:80/ACUWS_EscuelaConduccionACUProd/rest',
  //url_ws: 'http://192.1.33.1/ACU-EscuelaConduccion-Backend/rest',

  url_Backend_Charp: 'https://localhost:44380/api',
  url_Oracle: 'http://192.1.33.1:87/Oracle/',

  //url_Backend_Charp: 'http://192.1.33.1/BackendEscuelaCsharp/api',

  apiFormularios: 'http://192.1.33.1/ACU-Formularios-Backend-Prod/api', //'http://192.1.0.86/FormularioTest/api', //http://192.1.33.1/ACU-Formularios-Backend-Prod/api',
  pageSize: 100,
};

/*
url_ws: 'http://192.1.0.86/ACUWSv15ACUTesting/rest',

  url_ws: 'http://192.1.0.86/ACUWSv15/rest',


Url api net v16 SQLServer:
  url_ws: 'http://192.1.0.86/ACUWSv15ACUProd/rest',
  url_soap: 'http://192.1.0.86/ACUWSv15/',

Url api net v16 SQLServer:
  url_ws: 'http://192.1.0.86/ACUWSv16/rest',
  url_soap: 'http://192.1.0.86/ACUWSv16/',

Url api NetCore v16 SQLServer:
  url_ws: 'http://192.1.0.86/ACUWSv16NetCore/rest',
  url_soap: 'http://192.1.0.86/ACUWSv16NetCore/',


Url api local desarrollo SQLServer:
  url_ws: 'http://localhost/ACU_web/rest',
  url_soap: 'http://localhost/ACU_web/',

  Url api desarrollo SQLServer:
  url_ws: 'http://192.1.0.86/ACU_WS.NetEnvironment/rest',
  url_soap: 'http://192.1.0.86/ACU_WS.NetEnvironment/',

Url api TESTING SQLServer:
  url_ws: 'http://192.1.0.86/ACU_WSACUTesting/rest',
  url_soap: 'http://192.1.0.86/ACU_WSACUTesting/',

Url api TESTING MariaDB:
  url_ws: 'http://192.1.0.86/ACU_MariaDBWS.NetEnvironment/rest',
  url_soap: 'http://192.1.0.86/ACU_MariaDBWS.NetEnvironment/',

URL api prod Oracle:

  url_ws: 'http://192.1.0.71/ACU_Web.NetEnvironment/rest',
  url_soap: 'http://192.1.0.71/ACU_Web.NetEnvironment/',

*/

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
