// Inicializacion de todo lo que se necesita para arrancar

"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const restService = express();
const mysql = require('mysql');


restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());

// Funcion que se llama desde DialogFlow

restService.post("/echo", function(req, res) {

  var Sensores =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.Sensores
      ? req.body.queryResult.parameters.Sensores
      : "vacio";
  var Estacion =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.Estacion
      ? req.body.queryResult.parameters.Estacion
      : "vacio";

  var respuesta = "";
  var idsensor = "";
  var idestacion = "";
  var tipoValor = "";

  if (Sensores == "vacio" || Estacion == "vacio") {
    respuesta = "Disculpe, necesito que indique el sensor y la estacion."
  }else{

    if (Estacion == "Neurona 1") {
      idestacion = "1";
        switch(Sensores){
          case "Temperatura Ambiente":
            idsensor = "1";
            tipoValor = "grados centigrados";
            break;
          case "Humedad Ambiente":
            idsensor = "2";
            tipoValor = "por ciento";
            break;
          case "Radiación UV":
            idsensor = "3";
            tipoValor = "radiacion ultra violeta";
            break;
          case "Luminosidad LUX":
            idsensor = "4";
            tipoValor = "lux";
            break;
          case "Dióxido de Carbono":
            idsensor = "5";
            tipoValor = "partes por millon";
            break;
          case "Flujo de Agua":
            idsensor = "6";
            tipoValor = "litros";
            break;
          case "Dirección de Viento":
            idsensor = "7";
            tipoValor = "N/S";
            break;
          case "Humedad De Sustrato 1":
            idsensor = "8";
            tipoValor = "pascales";
            break;
          case "Temperatura Sustrato 1":
            idsensor = "9";
            tipoValor = "grados centigrados";
            break;
          case "Contenido Volumétrico de Agua":
            idsensor = "10";
            tipoValor = "por ciento";
            break;
          case "Conductividad Eléctrica":
            idsensor = "11";
            tipoValor = "siemens entre centimetros";
            break;
          case "Temperatura Sustrato 2":
            idsensor = "12";
            tipoValor = "grados centimetros";
            break;
          case "Voltage Estación Solar":
            idsensor = "13";
            tipoValor = "volts";
            break;
          case "Velocidad De Viento":
            idsensor = "14";
            tipoValor = "kilometros por hora";
            break;
          case "Pluviómetro":
            idsensor = "15";
            tipoValor = "milimetros";
          break;
        }
    }else if (Estacion == "Neurona 2") {
      idestacion = "2";
        switch(Sensores){
          case "Temperatura Ambiente":
            idsensor = "1";
            tipoValor = "grados centigrados";
            break;
          case "Humedad Ambiente":
            idsensor = "2";
            tipoValor = "por ciento";
            break;
          case "Radiación UV":
            idsensor = "3";
            tipoValor = "radiacion ultra violeta";
            break;
          case "Luminosidad LUX":
            idsensor = "4";
            tipoValor = "lux";
            break;
          case "Dióxido de Carbono":
            idsensor = "5";
            tipoValor = "partes por millon";
            break;
          case "Flujo de Agua":
            idsensor = "6";
            tipoValor = "litros";
            break;
          case "Dirección de Viento":
            idsensor = "7";
            tipoValor = "N/S";
            break;
          case "Humedad De Sustrato 1":
            idsensor = "8";
            tipoValor = "pascales";
            break;
          case "Temperatura Sustrato 1":
            idsensor = "9";
            tipoValor = "grados centigrados";
            break;
          case "Contenido Volumétrico de Agua":
            idsensor = "10";
            tipoValor = "por ciento";
            break;
          case "Conductividad Eléctrica":
            idsensor = "11";
            tipoValor = "siemens entre centimetros";
            break;
          case "Temperatura Sustrato 2":
            idsensor = "12";
            tipoValor = "grados centimetros";
            break;
          case "Voltage Estación Solar":
            idsensor = "13";
            tipoValor = "volts";
            break;
          case "Velocidad De Viento":
            idsensor = "14";
            tipoValor = "kilometros por hora";
            break;
          case "Pluviómetro":
            idsensor = "15";
            tipoValor = "milimetros";
          break;
        }
    }

    var id_lectura = "";

    ConsultaLectura("1", function(result) {

        id_lectura = result;
        
        respuesta = Sensores + " en la " + Estacion + " es de "+ id_lectura + " " + tipoValor;
        
    });


    

  }
  return res.json({
    fulfillmentText: respuesta,
    source: "webhook-echo-sample"
  });
});


function ConsultaLectura(id_estacion, resultado) {
    

    var connection = mysql.createConnection({
      host: 'emecdrive.com',
      user: 'emecdriv',
      password: 'oI32k6cw5Q',
      database: 'emecdriv_emec'
    });

    connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });

    var returnValue = "Valor";

    connection.query("SELECT MAX(id) AS id FROM lectures WHERE station_id = "+id_estacion, function(error, result){
            if(error){
               throw error;
            }else{
              returnValue = result[0].id;
              resultado(returnValue);
            }
         }
    );

    connection.end();
}


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});






