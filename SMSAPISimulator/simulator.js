// Generated by CoffeeScript 1.8.0
(function() {
  var app, encounters, express, records, server;
  express = require("express");
  var bodyParser = require('body-parser');
  var simulatorAPI =require ("./lib/api");
 // var dao =require ("./lib/dao");
  var smsKeyWord=simulatorAPI.getSMSKeyWord();
	function errorHandler(err, req, res, next) {
	  if (res.headersSent) {
		return next(err);
	  }
	  res.status(500);
	  res.render('error', { error: err });
	}
  app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  //app.use(express.static(entityAPI.resolvePathDirectory(__dirname,'public')));
  app.use(errorHandler);
  server = app.listen(process.env.PORT || 8085, function() {
    return console.log("SMS API Simulator  is running on port:" + (server.address().port));
  });

	app.param ("token", function (req,res,next,token)
	{
		req.token=token;
		next();
	});
	app.param ("from", function (req,res,next,from)
	{
		req.from=from;
		next();
	});
	app.param ("text", function (req,res,next,text)
	{
		req.text=text;
		next();
	});
	app.param ("to", function (req,res,next,to)
	{
		req.to=to;
		next();
	});
	function receiveSMS(token,from,to,text,res)
	{
		var cleanedText=text;
		simulatorAPI.receiveSMS(token,from,to,cleanedText,function(resRequest)
		{
			console.log("Messages received");
			res.json(resRequest);
			return res.end();
		});
	}
	app.get("/sms/token=:token&from=:from&to=:to&text=:text", function (req,res,next)
	{
		//sendSMS(req.from,req.text,req.to,req.id,res);
		console.log("Enter...");
		receiveSMS(req.token,req.from,req.to,req.text,res);
		
	});
	/*
	app.get ("/sendsms", function (req,res,next)
	{
		console.log(req.query);
	});
	* */

}).call(this);
