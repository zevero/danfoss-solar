var danfoss = require('../model/danfoss')
    ;
/*
 * GET home page.
 */

module.exports = {
  index: function(req, res){
    res.render('index', { title: 'Danfoss', dates: danfoss.dates()});
  },
  show: require('./show')
};