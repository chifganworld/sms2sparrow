var mongoose = require('mongoose');
//var autoIncrement = require('mongoose-auto-increment'); 
 
mongoose.connect('mongodb://localhost:27017/sms2db');
var Schema=mongoose.Schema;
//id_sparrow: smsid generate by sparrow
//direction: in from sparrow,out from rapidpro
//status: 0 if message not notify to rapidpro,1 if notify to rapidpro


var smsSchema = Schema({
	id:String,
	id_sparrow:String,
	direction:String, 
	from: String,
	text:String,
	to:String,
	status:String,
	dateSent:Date,
	dateLog:Date
});
var Counters = new Schema({
  _id:String, // the schema name
  count: Number
});
Counters.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};
//autoIncrement.initialize(mongoose.connection);
//CounterSchema.plugin(autoIncrement.plugin, 'Sms');
var Sms=mongoose.model('Sms',smsSchema);
var Counter = mongoose.model('Counter', Counters);
function incrementCounter(schemaName, callback){
  Counter.findAndModify({ _id: schemaName }, [], 
    { $inc: { count: 1 } }, {"new":true, upsert:true}, function (err, result) {
      if (err)
        callback(err);
      else
        callback(null,result.count);
  });
}
var  getSMSCurrentCounter=function (callback)
{
	incrementCounter("Sms",function(res)
	{
		//console.log(res);
		Counter.findOne({}).exec(function(error,msgs){
		if(error) return handleError(err);
		return callback(msgs.count);
		});
	});
}

//Status 1:sent 0:fail
var saveSMS = function(_id,_from,_to,callback)
{
	var currentDate=new Date().toJSON();
	var smsToAdd=new Sms({id:_id,id_sparrow:null,direction:"out",from:_from,text:null,to:_to,status:"0",dateSent:null,dateLog:currentDate});
	var requestResult=smsToAdd.save(function(err,result){
		if(err) return handleError(err);
		if(result!==null) 
		{
			return callback(true);
		}
		else
		{
			return callback(false);
		}
		});
}
var saveReceivedSMS = function(_from,_text,_to,callback)
{
	getSMSCurrentCounter(function(resdB)
	{
		//console.log(resdB)
		var generatedId=resdB;
		var currentDate=new Date().toJSON();
		var smsToAdd=new Sms({id:null,id_sparrow:generatedId,direction:"in",from:_from,text:_text,to:_to,status:"0",dateSent:currentDate,dateLog:null});
		var requestResult=smsToAdd.save(function(err,result){
			if(err) return handleError(err);
			if(result!==null) 
			{
				return callback(true);
			}
			else
			{
				return callback(false);
			}
			});
	});
	
}
var getListSMS	= function(callback){
	var requestResult=Sms.find({"dateSent":null}).sort({dateLog:1}).exec(function(error,msgs){
		if(error) return handleError(err);
		return callback(msgs);
		});
}
var getListSMS3	= function(callback){
	var requestResult=Sms.findOne({"dateSent":null,"direction":"out"}).exec(function(error,msgs){
		if(error) return handleError(err);
		return callback(msgs);
		});
}
var getListReceivedSMS	= function(callback){
	var requestResult=Sms.findOne({"dateLog":null,"direction":"in"}).exec(function(error,msgs){
		if(error) return handleError(err);
		return callback(msgs);
		});
}
var getListSMS2	= function(){
	var exchangeAPI =require ("./api");
	var MongoClient = require('mongodb').MongoClient;
	var url="mongodb://localhost:27017/sms2db";
	MongoClient.connect(url, function(err, db) {
		if (err) throw handleError(err);
		db.collection('sms').find({"dateSent":null}).toArray(function(error,msgs)
		{
			if(error) return handleError(err);
			var listMsg=[];
			for(var i=0;i<msgs.length;i++)
			{
				listMsg.push(msgs[i]);
			}
			//console.log(listMsg);
			//return callback(msgs);
			for(var i=0;i<listMsg.length;i++)
			{
				editSMS(listMsg.id,"1",function(resDB)
				{
					if(resDB==true)
					{
						console.log("Success: SMS logged in the DB");
					}
					else
					{
						console.log("Fail: SMS not logged in the DB");
					}
				})
			}
			});
	});
	
}
var editSMS=function(idToEdit,status,callback)
{
	var currentDate=new Date().toJSON();
	var requestResult=Sms.update({"id":idToEdit},{$set:{"status":"1","dateSent":currentDate}},function(error,res){
		if(error)
		{
			console.error(error);
			return callback(-1);
		} 
		return callback(true);
	});
}
exports.saveSMS=saveSMS;
exports.saveReceivedSMS=saveReceivedSMS;
//exports.getSMSCurrentCounter=getSMSCurrentCounter;
exports.getListSMS=getListSMS;
exports.getListSMS2=getListSMS2;
exports.getListSMS3=getListSMS3;
exports.getListReceivedSMS=getListReceivedSMS;
exports.editSMS=editSMS;
