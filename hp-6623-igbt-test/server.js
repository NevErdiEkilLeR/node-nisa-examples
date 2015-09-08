var async = require('async');
var Visa = require("node-nisa").Visa;
var csv = require('to-csv');
var fs = require('fs');

var hp6623 = new Visa("GPIB0::12::INSTR");

var data = [];
 
for (var ge = 0; ge < 10; ge = ge + 2) {
    for (var ce = 0; ce < 15; ce = ce + 0.2) {
      data.push({ 
          Vge: ge,
          Vce: ce, 
          value: NaN
      });
    }
}

function displayResult(err, res, callback) {
  
  if (typeof(callback) == 'function') {
    console.log("calling back");
    return callback;
  }
  
}

async.series([
  function (callback) { hp6623.open(callback); },
  function (callback) { hp6623.deviceClear(callback); },
  function (callback) { hp6623.query("ID?", callback) },
  function (callback) { hp6623.write("ISET 2,0.2", callback) },
  function (callback) { hp6623.write("ISET 3,1", callback) },
  function (callback) {
        async.forEachOfSeries(data, function (v, k, next) {
          async.series([
            function (callback) { hp6623.write("VSET 2," + v.Vge, callback) },
            function (callback) { hp6623.write("VSET 3," + v.Vce, callback) },
            function (callback) { hp6623.query("IOUT? 3", function(err, res) {
              var response = res.toString('ascii');
              v.value = Number(response);
              return callback();
            })}
          ], next); 
        }, callback);
  },
  function (callback) { hp6623.write("VSET 2,0", callback) },
  function (callback) { hp6623.write("VSET 3,0", callback) },
  function (callback) { hp6623.close(callback) }
], function (err, res) {
  if (err) {
    console.log('ERROR');
    console.log(err);
  } else {
    console.log('DONE');
    console.log(res);
  }
  fs.writeFile('result.csv', csv(data), function (err) {
    if (err) 
      return console.log(err);
    else 
      return console.log('Done writing CSV to disk!');
  });
});
 


