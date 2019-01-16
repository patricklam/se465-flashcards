const express = require('express');
const fs = require('fs');
const router = express.Router();
const formidable = require('express-formidable');

router.get('/test', function(req, res, next) {
  res.sendStatus(200);
});

router.post("/update", function(req, res, next) {
  const db = req.app.get('db');
  let _id = req.body._id, col = req.body.col, val = req.body.val;
  
  const op = { $set: {} };
  op.$set[col] = val;
  db.update({ _id: _id }, op, function (err) { 
    if (err) res.sendError(500);
    res.sendStatus(200);
  });
});

router.post("/delete", function(req, res, next) {
  const db = req.app.get('db');
  let _id = req.body._id;
  
  db.remove({ _id: _id }, function (err) { 
    if (err) res.sendError(500);
    res.sendStatus(200);
  });
});

router.post("/upload", formidable(), function(req, res, next) {
  const db = req.app.get('db');
  const img = req.files.image;
  fs.readFile(img.path, (err, data) => {
    if (err) res.sendError(500);
    let buff = new Buffer.from(data);
    let base64_imgdata = buff.toString("base64");
    db.insert({imgdata: base64_imgdata, location: '?', correct: 0, total: 0}, function (err, newDoc) {
      if (err) res.sendError(500);
      res.send(newDoc._id);
    });
  });
});

// note that this API is controllable but not observable!

module.exports = router;