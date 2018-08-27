// Inicializacion de todo lo que se necesita para arrancar

"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const restService = express();
const mysql = require('mysql');

const HOST = "74.208.160.86";
const USER = "root";
const PASSWORD = "Hs1EE00b05";
const DATABASE = "neurona_wireless";

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
  	//En esta parte se confirma que se enviaron los parametros correctos
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
  			idsensor = "4";
  			tipoValor = "radiacion ultra violeta";
  			break;
  		case "Luminosidad LUX":
  			idsensor = "3";
  			tipoValor = "lux";
  			break;
  		case "Dióxido de Carbono":
  			idsensor = "5";
  			tipoValor = "partes por millon";
  			break;
  		case "Flujo de Agua":
  			idsensor = "11";
  			tipoValor = "litros";
  			break;
  		case "Dirección de Viento":
  			idsensor = "7";
  			tipoValor = "";
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
  			idsensor = "14";
  			tipoValor = "siemens centímetros";
  			break;
  		case "Temperatura Sustrato 2":
  			Sensores = "Temperatura de Sustrato";
  			idsensor = "12";
  			tipoValor = "grados centigrados";
  			break;
  		case "Voltage Estación Solar":
  			idsensor = "15";
  			tipoValor = "volts";
  			break;
  		case "Velocidad De Viento":
  			idsensor = "6";
  			tipoValor = "kilometros por hora";
  			break;
  		case "Pluviómetro":
  			idsensor = "8";
  			tipoValor = "milimetros";
  			break;
	  }

	var array = Estacion.split(" ");
	idestacion = array[1];

    var id_lectura = "";
    var valor_lectura = "";

    ConsultaLectura(idestacion, function(result) {

        id_lectura = result;

        if (id_lectura != null) {

          ConsultaValor(id_lectura,idsensor, function(result) {

            valor_lectura = result;

            if (valor_lectura != null) {
              respuesta = Sensores + " en la " + Estacion + " es de "+ valor_lectura + " " + tipoValor +". ¿Necesitas algo más? ";

              return res.json({
                fulfillmentText: respuesta,
                source: "webhook-echo-sample"
              });
            }else{
              respuesta = "Lo siento, no he encontrado esa información ¿Deseas que busque algo más?";
              return res.json({
                  fulfillmentText: respuesta,
                  source: "webhook-echo-sample"
              });
            }

          });

        }else{
          respuesta = "Lo siento, no he encontrado esa información ¿Deseas que busque algo más?";
          return res.json({
              fulfillmentText: respuesta,
              source: "webhook-echo-sample"
          });
        }
    });
  }
  return res.json({
    fulfillmentText: respuesta,
    source: "webhook-echo-sample"
  });

});


function ConsultaLectura(id_estacion, resultado) {
    var connection = mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE
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

function ConsultaValor(id_lectura,id_sensor, resultado) {
    var connection = mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE
    });
    connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });
    var returnValue = "Valor";
    var Sentencia = "SELECT value FROM registers WHERE lecture_id = '"+id_lectura+"' AND sensor_id = '"+id_sensor+"'";
    connection.query(Sentencia, function(error, result){
        if(error){
           throw error;
        }else{
          returnValue = result[0].value;
          resultado(returnValue);
        }
      }
    );
    connection.end();
}

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});






