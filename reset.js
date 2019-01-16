// initialize the db according to local-assets
const fs = require('fs');

function initializeAssets(app) {
  var db = app.get('db');
  
  // wipe the db
  db.remove({ }, { multi: true }, function (err, numRemoved) {
    db.loadDatabase(function (err) {
    // done
    });
  });
  
  fs.open('./local-assets/default-values', 'r', function(err, fileToRead) {
    if (!err) {
      fs.readFile(fileToRead, {encoding: 'utf-8'}, function(err, data) {
        if (!err) {
          var lines = data.split('\n');
          var N = 0;
          lines.forEach(line => {
            var kv = line.split('|');
            if (kv.length < 2) return;
            var fname = kv[0], location = kv[1];
            db.insert({ fname: fname, location: location, correct: 0, total: 0}, function (err, imageAdded) {
              if(err) console.log("There's a problem with the database: ", err);
              else if(imageAdded) console.log("New image inserted in the database");
            });
          });
          }else{
          console.log(err);
        }
      })
    }else{
      console.log(err);
    }
  });
}

function reset(app) {
  initializeAssets(app);
}

module.exports.reset = reset;