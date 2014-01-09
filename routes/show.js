var danfoss = require('../model/danfoss')
    ;


module.exports = {
  day: function(req, res){
    var date = req.params.date;
    res.render('show/day', { title: date, day_json: danfoss.day_json(date) });
  }
};