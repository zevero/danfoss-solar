var danfoss = require('../model/danfoss')
    ;


module.exports = {
  day: function(req, res){
    var date = req.params.date;
    res.render('show/day', { title: date, S: danfoss.day_highchart(date) });
  },
  day_sma: function(req, res, next){
    var date = req.params.date;
    var day =danfoss.day(date);
    if (day) {
      res.set('Content-Type', 'text/comma-separated-values');
      res.render('sma/csv', { title: date, day: danfoss.day(date) });
    }
    else next();
  },
  daily: function(req, res){
    res.render('show/daily', { title: 'Danfoss Daily String Comparison', data: danfoss.days()});
  }
};