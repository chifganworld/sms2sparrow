/**
 *  setup for test/development mode
 */
 //var btoa = require('btoa')
 var fs = require("fs");
 //var fs_extra = require("fs-extra");
 var path = require("path");
 var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var production = false;
var simulationMode=true;
var supportSpecialCharset=true;

/*
 * Setup for production mode
 */

const manifest = ReadJSONFile("manifest.webapp");
//console.log(manifest);
const gatewayURL = manifest.activities.SMSAPI.callbackurl;
var shortCode=manifest.activities.SMSAPI.shortcode;
var tokenSparrow=manifest.activities.SMSAPI.token;
const headersSPARROW =  {tokenSparrow, 'Content-Type': 'application/json' };
if(manifest.simulationMode=="on")
{
	simulationMode=true;
}
else
{
	simulationMode=false;
}
if(manifest.supportSpecialCharset=="on")
{
	supportSpecialCharset=true;
}
else
{
	supportSpecialCharset=false;
}

//console.log("server sparrow:", URLSPARROW, "headers:", headersSPARROW);
//console.log("server sms2:", URLRP, "headers:", headersRP);

/***********************************************************/

/**
 * Default options object to send along with each request
 */
const fetchOptionsSPARROW = {
    method: 'GET',
    headers: headersSPARROW
};
function ReadJSONFile(fileName)
{
	var arrayPath=__dirname.split('/');
	var parentDirectory="/";
	for(var i=0;i<(arrayPath.length)-1;i++)
	{
		parentDirectory+=arrayPath[i]+"/";
	}
	//console.log("-------------");
	var filePath=path.resolve(path.join(parentDirectory, "/", fileName));
	//console.log(filePath);
	
	var contents = fs.readFileSync(filePath);
	console.log(filePath);
	var jsonContent = JSON.parse(contents);
	return jsonContent;
}
/////////////////************************Function SMS processing******************///////
exports.receiveSMS= function receiveSMS(token,from,to,text,callback)
{
	var reqResponse="";
	if(token!=tokenSparrow)
	{
		//console.log("!!!------token mismatch-------");
		reqResponse=JSON.parse('{"response_code":1002,"response":"Invalid Token"}');
		return callback(reqResponse);
	}
	else
	{
		//console.log("!!!------token match-------");
		var currentDate=new Date().toJSON();
		console.log(""+currentDate+"| "+text+"");
		console.log("------------------------------");
		reqResponse=JSON.parse('{"count": 1,"response_code": 200,"response": "number_of_sms_sent mesages has been queued for delivery"}');
		return callback(reqResponse);
	}
}

exports.getSMSKeyWord = function getSMSKeyWord()
{
	return manifest.smsKeyword;
}
exports.getSupportSpecialCharset=function getSupportSpecialCharset()
{
	return supportSpecialCharset;
}
exports.getToken=function getToken()
{
	return tokenSparrow;
}
