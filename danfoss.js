
/**
 * Module dependencies.
 */

var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var serveStatic = require('serve-static');
var errorHandler = require('errorhandler');

var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
app.use(favicon(path.join(__dirname,'public/images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(serveStatic(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(errorHandler());
}

app.get('/',routes.index);
app.get('/show/daily', routes.show.daily);
app.get('/show/:date', routes.show.day);
app.get('/sma/:date.CSV', routes.show.day_sma);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
