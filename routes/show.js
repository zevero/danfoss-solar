var danfoss = require('../model/danfoss')
    ;


module.exports = {
  day: function(req, res){
    var date = req.params.date;
    res.render('show/day', { title: date, S: danfoss.day_highchart(date) });
  }
};