var danfoss = require('../model/danfoss')
    ;

module.exports = function(req, res){
  var date = req.params.date;
  res.set('Content-Type', 'text/comma-separated-values');
  res.render('sma/csv', { title: date, day: danfoss.day(date) });
};