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
  var id_sensor = "";
  var idestacion = "";
  var tipoValor = "";

  if (Sensores == "vacio" || Estacion == "vacio") {
    respuesta = "Disculpe, necesito que indique el sensor y la estacion.";
    return res.json({
      fulfillmentText: respuesta,
      source: "webhook-echo-sample"
    });
  }else{
  	switch(Sensores){
  		case "Temperatura Ambiente":
  			id_sensor = "1";
  			tipoValor = "grados centigrados";
  			break;
  		case "Humedad Ambiente":
  			id_sensor = "2";
  			tipoValor = "por ciento";
  			break;
  		case "Radiación UV":
  			id_sensor = "3";
  			tipoValor = "radiacion ultra violeta";
  			break;
  		case "Luminosidad LUX":
  			id_sensor = "4";
  			tipoValor = "lux";
  			break;
  		case "Dióxido de Carbono":
  			id_sensor = "5";
  			tipoValor = "partes por millon";
  			break;
  		case "Flujo de Agua":
  			id_sensor = "6";
  			tipoValor = "litros";
  			break;
  		case "Dirección de Viento":
  			id_sensor = "7";
  			tipoValor = "N";
  			break;
  		case "Humedad De Sustrato":
  			id_sensor = "8";
  			tipoValor = "pascales";
  			break;
  		case "Temperatura Sustrato":
  			id_sensor = "11";
  			tipoValor = "grados centigrados";
  			break;
  		case "Contenido Volumétrico de Agua":
  			id_sensor = "9";
  			tipoValor = "por ciento";
  			break;
  		case "Conductividad Eléctrica":
  			id_sensor = "10";
  			tipoValor = "siemens centímetros";
  			break;
  		case "Voltage Estación Solar":
  			id_sensor = "12";
  			tipoValor = "volts";
  			break;
  		case "Velocidad De Viento":
  			id_sensor = "13";
  			tipoValor = "kilometros por hora";
  			break;
  		case "Pluviómetro":
  			id_sensor = "14";
  			tipoValor = "milimetros";
  			break;
	  }

  	var array = Estacion.split(" ");
  	idestacion = array[1];

    var id_lectura = "";
    var valor_lectura = "";

    ConsultaLectura(idestacion, function(result) {
        id_lectura = result;
        respuesta = id_lectura + "sensor: "+ id_sensor;
        return res.json({
            fulfillmentText: respuesta,
            source: "webhook-echo-sample"
        });
        if (id_lectura != null) {
          ConsultaValor(id_lectura,id_sensor, function(result) {
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






