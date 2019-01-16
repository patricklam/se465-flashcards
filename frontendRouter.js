const express = require('express');
const router = express.Router();
const reset = require('./reset');

function readFromDb(app, res, continuation) {
  const db = app.get('db');
}

router.get('/', function(req, res, next) {
  const db = req.app.get('db');

  // update with result from previous card
  let previous_id = req.query._id;
  let verdict = req.query.verdict === "1";
  // (structured repetition would save more info here)
  const op = verdict ? { $inc: {"total": 1, "correct": 1} }
                     : { $inc: {"total": 1 } };
  db.update({ _id: previous_id }, op);
  
  // fetch a new flashcard
  db.find({}, function(err, dbImages) {
    // (structured repetition would choose the optimal next img)
    // Q: how do we test deterministically?
    var img = Math.floor(Math.random()*dbImages.length);
    res.render('quiz', { img: dbImages[img] });
  });
});

router.get('/edit', function(req, res, next) {
  const db = req.app.get('db');
  db.find({}, function(err, dbImages) {
    res.render('edit', { title: 'Edit', values: dbImages });
  });
});

router.get('/reset', function(req, res, next) {
  reset.reset(req.app);
  res.render('reset', { title: 'SE 465 Flashcards DB Reloaded', action: 'reset' });
});

router.get('/clear', function(req, res, next) {
  const db = req.app.get('db');
  const op = { $set: {"total": 0, "correct": 0} };
  db.update({ }, op, { multi: true });
  res.render('reset', { title: 'SE 465 Flashcards Counts Cleared', action: 'clear' });
});

module.exports = router;
