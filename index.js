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
  var email =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.email
      ? req.body.queryResult.parameters.email
      : "vacio";

  var respuesta = "";
  var id_sensor = "";
  var idestacion = "";
  var tipoValor = "";

  //var contador = req.data.count = 1;

  //Antes de todo, se consultara el email

  ConsultaEmail(email, function(result) {
    if (result != null || result != "NoEmail") {
      //result contiene el id del usuario
      respuesta = "Tienes el id = "+result;
      return res.json({
        fulfillmentText: respuesta,
        source: "webhook-echo-sample"
      });
    }else{
      respuesta = "Lo siento, no estas en registrado en nuestro sistema";
      return res.json({
          fulfillmentText: respuesta,
          source: "webhook-echo-sample"
      });
    }
  });
/*

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
  		case "Luminosidad LUX":
  			id_sensor = "3";
  			tipoValor = "Kiloluxes";
  			break;
  		case "Radiación UV":
  			id_sensor = "4";
  			tipoValor = "radiación ultravioleta";
  			break;
  		case "Dióxido de Carbono":
  			id_sensor = "5";
  			tipoValor = "partes por millon";
  			break;
  		case "Contenido Volumétrico de Agua": 
  			id_sensor = "6";
  			tipoValor = "por ciento";
  			break;
  		case "Conductividad Eléctrica":
  			id_sensor = "7";
  			tipoValor = "miliSiemes entre centimetro";
  			break;
  		case "Temperatura Sustrato":
  			id_sensor = "8";
  			tipoValor = "pascales";
  			break;
  		case "Drenaje":
  			id_sensor = "9";
  			tipoValor = "por ciento";
  			break;
  		case "Flujo de Agua":
  			id_sensor = "10";
  			tipoValor = "litros";
  			break;
      case "Velocidad De Viento":
        id_sensor = "11";
        tipoValor = "kilometros por hora";
        break;
  		case "Dirección de Viento":
  			id_sensor = "12";
  			tipoValor = "N/S/E/O";
  			break;
  		case "Pluviómetro":
  			id_sensor = "13";
  			tipoValor = "milimetros";
  			break;
  		case "Voltaje Estación Solar":
  			id_sensor = "14";
  			tipoValor = "volts";
  			break;
	  }

  	var array = Estacion.split(" ");
  	idestacion = array[1];

    var id_lectura = "";
    var valor_lectura = "";

    ConsultaLectura(idestacion, function(result) {
        id_lectura = result;
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

*/


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
        returnValue = null;
        resultado(returnValue);
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
          returnValue = null;
          resultado(returnValue);
        }else{
          returnValue = result[0].value;
          resultado(returnValue);
        }
      }
    );
    connection.end();
}

function ConsultaEmail(email) {
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
    var returnValue = "NoEmail";
    var Sentencia = "SELECT id FROM users WHERE email = '"+email+"'";
    connection.query(Sentencia, function(error, result){
        if(error){
          returnValue = null;
          resultado(returnValue);
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






