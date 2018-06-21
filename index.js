// Inicializacion de todo lo que se necesita para arrancar

"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const restService = express();
const mysql = require('mysql');
var id_lectura = "";
var id_registro = "";
var valor = "";
var tipoValor = "";

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());

// Conexion

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

  if (Sensores == "vacio" || Estacion == "vacio") {
    respuesta = "Disculpe, necesito que indique el sensor y la estacion."
  }else{

    if (Estacion == "Neurona 1") {
      idestacion = "1";
        switch(Sensores){
          case "Temperatura Ambiente":
            idsensor = "1";
            break;
          case "Humedad Ambiente":
            idsensor = "2";
            break;
          case "Radiación UV":
            idsensor = "3";
            break;
          case "Luminosidad LUX":
            idsensor = "4";
            break;
          case "Dióxido de Carbono":
            idsensor = "5";
            break;
          case "Flujo de Agua":
            idsensor = "6";
            break;
          case "Dirección de Viento":
            idsensor = "7";
            break;
          case "Humedad De Sustrato 1":
            idsensor = "8";
            break;
          case "Temperatura Sustrato 1":
            idsensor = "9";
            break;
          case "Contenido Volumétrico de Agua":
            idsensor = "10";
            break;
          case "Conductividad Eléctrica":
            idsensor = "11";
            break;
          case "Temperatura Sustrato 2":
            idsensor = "12";
            break;
          case "Voltage Estación Solar":
            idsensor = "13";
            break;
          case "Velocidad De Viento":
            idsensor = "14";
            break;
          case "Pluviómetro":
            idsensor = "15";
          break;
        }
    }else if (Estacion == "Neurona 2") {
      idestacion = "2";
        switch(Sensores){
          case "Temperatura Ambiente":
            idsensor = "1";
            break;
          case "Humedad Ambiente":
            idsensor = "2";
            break;
          case "Radiación UV":
            idsensor = "3";
            break;
          case "Luminosidad LUX":
            idsensor = "4";
            break;
          case "Dióxido de Carbono":
            idsensor = "5";
            break;
          case "Flujo de Agua":
            idsensor = "6";
            break;
          case "Dirección de Viento":
            idsensor = "7";
            break;
          case "Humedad De Sustrato 1":
            idsensor = "8";
            break;
          case "Temperatura Sustrato 1":
            idsensor = "9";
            break;
          case "Contenido Volumétrico de Agua":
            idsensor = "10";
            break;
          case "Conductividad Eléctrica":
            idsensor = "11";
            break;
          case "Temperatura Sustrato 2":
            idsensor = "12";
            break;
          case "Voltage Estación Solar":
            idsensor = "13";
            break;
          case "Velocidad De Viento":
            idsensor = "14";
            break;
          case "Pluviómetro":
            idsensor = "15";
          break;
        }
    }

    //llama a la consulta que da la lectura
    Consulta1(idestacion);
    //llama a la consulta que da el id de registro
    Consulta2(id_lectura,idsensor);
    //llama a la consulta que da el valor
    Consulta3(id_registro);

    respuesta = "El ultimo registro de "+valor;

  }
  return res.json({
    fulfillmentText: respuesta,
    source: "webhook-echo-sample"
  });
});

function Consulta1(id_lec){

  var Sentencia = "SELECT MAX(id) AS id FROM lectures WHERE station_id = "+id_lec;

  connection.query(Sentencia, function(error, result){
          if(error){
             throw error;
          }else{
            id_lectura = result[0].id;
          }
       }
  );
}

function Consulta2(id_lec, id_sens){

  var Sentencia = "SELECT MAX(id) AS id FROM registers WHERE lecture_id = '"+id_lec+"' AND sensor_id = '"+id_sens+"'";

  connection.query(Sentencia, function(error, result){
          if(error){
             throw error;
          }else{
            id_registro = result[0].id;
          }
       }
  );

}


function Consulta3(id_reg){

  var Sentencia = "SELECT value FROM registers WHERE id = "+id_reg;

  connection.query(Sentencia, function(error, result){
          if(error){
             throw error;
          }else{
            valor = result[0].value;
          }
       }
  );
  
}


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
