var danfoss = require('../model/danfoss')
    ;

module.exports = function(req, res, next){
  var date = req.params.date;
  var day =danfoss.day(date);
  if (day) {
    res.set('Content-Type', 'text/comma-separated-values');
    res.render('sma/csv', { title: date, day: danfoss.day(date) });
  }
  else next();
};