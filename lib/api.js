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
const URLSPARROW = manifest.activities.SMSAPI.url;
const URLRP = manifest.activities.rapidpro.url;
const URLSecureRP = manifest.activities.rapidpro.secureUrl;
var shortCode=manifest.activities.SMSAPI.shortcode;
var tokenSparrow="Authorization: Token "+ manifest.activities.SMSAPI.token;
var tokenRP='Authorization: Token '+ manifest.activities.rapidpro.token;
var uid= manifest.activities.rapidpro.uid;
const headersSPARROW =  {tokenSparrow, 'Content-Type': 'application/json' };
const headersRP =  {tokenRP, 'Content-Type': 'application/json' };
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
const fetchOptionsRP = {
    method: 'GET',
    headers: headersRP
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
exports.SendSMS= function SendSMS(from,text,to,id,callback)
{
	var urlRequest=`${URLSPARROW}/?&token=${manifest.activities.SMSAPI.token}&from=${from}&to=${to}&text=${text}`;
	//var encodedUrl=encodeURIComponent(urlRequest);
	//var encodedUrl=unescape(encodeURIComponent(urlRequest));
	//var urlRequest=`${URLSPARROW}/`;
	//var params=`from=${from}&text=${text}&to=${to}}`;
	var now=new Date();
	var dateLog=now.toISOString();
	console.log(dateLog+" |Send url >>>>");
	console.log(urlRequest);
	
	//request.setRequestHeader('Content-Type','multipart/form-data');	
	//request.setRequestHeader('Authorization', 'Token '+manifest.activities.SMSAPI.token);	
	
	if(!simulationMode)
	{
		var request = new XMLHttpRequest();
		request.open('GET',urlRequest, true);
		request.setRequestHeader('Content-Type','text/html');	
		request.setRequestHeader('charset','UTF-8');
		request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			var myArr = JSON.parse(this.responseText);
			var modifiedArray = [myArr];
			console.log(myArr);
			return callback(modifiedArray);
			}
			else if (this.readyState == 4 && this.status != 200)
			{
				console.log("Error: "+this.responseText);
			}
		};
		request.send();
	}
	else
	{
		var myArr=[JSON.parse('{"response_code":200}')];
		return callback(myArr);
	}
}


exports.SendSMSAndNotifySuccess=function SendSMSAndNotifySuccess(from,text,to,id,callback)
{
	var urlRequest=`${URLSPARROW}/from=${from}&text=${text}&to=${to}&id=${id}`;
	console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');	
	request.setRequestHeader('Authorization: Token '+manifest.activities.SMSAPI.token);	
	if(!simulationMode)
	{
		request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			var myArr = JSON.parse(this.responseText);
			var modifiedArray = [myArr];
			//console.log(myArr);
			return callback(modifiedArray);
			}
			else if (this.readyState == 4 && this.status != 200)
			{
				console.log(this.responseText);
			}
		};
		request.send();
	}
	else
	{
		var myArr=[JSON.parse('{"status":200}')];
		console.log(myArr[0].status)
		//return callback(myArr);
		if(myArr[0].status==200)
		{
			notifySendSucceded(id,callback);
		}
		else
		{
			return callback([JSON.parse('{"response":"send and no notification"}')])
		}	
	}
}
exports.getListReceivedSMS=function getListReceivedSMS(callback)
{
	var urlRequest='http://52.208.62.172:8084/getReceivedSMS';
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');	
	//request.setRequestHeader('Authorization: Token '+manifest.activities.SMSAPI.token);
	request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			//console.log("res sms : "+this.responseText);
			var myArr=null;
			if(this.responseText!="")
			{
				var myArr = JSON.parse(this.responseText);
			}
			
			//var modifiedArray = [myArr];
			//console.log(myArr);
			return callback(myArr);
			}
			else if (this.readyState == 4 && this.status != 200)
			{
				console.log(this.responseText);
			}
		};
		request.send();
}
exports.notifySendSucceded=function notifySendSucceded(id,callback)
{
	var urlRequest=`${URLSecureRP}/sent/${uid}/?id=${id}`;
	console.log("Notifyurl>>>: "+urlRequest);
	var request = new XMLHttpRequest();
	request.open('POST',urlRequest, true);
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		var myArr=JSON.parse('{"response":"'+this.responseText+'"}');
		return callback([myArr]);
		}
		
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	};
	request.send();
}
exports.notifyReceivedSMS=function notifyReceivedSMS(from,text,date,callback)
{
	var escapedText="";
	var cleanedText="";
	if(supportSpecialCharset==true)
	{
		escapedText=encodeURIComponent(text);
		//cleanedText=escapedText.replace(/\%2B/g, '+');
	}
	else
	{
		cleanedText=text;
	}
	//var urlRequest=`${URLSecureRP}/received/${uid}/?from=${from}&text=${text}&date=${date}`;
	var urlRequest=`${URLSecureRP}/received/${uid}/?from=${from}&text=${cleanedText}&date=${date}`;
	var now=new Date();
	var dateLog=now.toISOString();
	console.log(dateLog+"| Notifyurl>>>: "+urlRequest);
	var request = new XMLHttpRequest();
	request.open('POST',urlRequest, true);
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		var myArr=JSON.parse('{"response":"'+this.responseText+'"}');
		return callback([myArr]);
		}
		
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	};
	request.send();
}
exports.getSMSKeyWord = function getSMSKeyWord()
{
	return manifest.smsKeyword;
}
exports.getSupportSpecialCharset=function getSupportSpecialCharset()
{
	return supportSpecialCharset;
}
