# SMSAPI Simulator
This app simulate an SMS Gateway that mimic Sparrows, it is used to test rapidPro on localhost with SMS2Sparrow apps without the need to reach contact through local network operator. Sending and reception of SMS are done through this plateform as if contact are connected to MNO
## Installation
This solution is deployed on ubuntu 14.04 or 16.04.
### Clone the app on your Host
```sh
git clone https://github.com/gerard-bisama/sms2sparrow.git
```
Then copy or move the repository SMSAPISimulator out of the main repository to be able to run the apps
```sh
cp -R sms2sparrow/SMSAPISimulator ~/
cd ~/SMSAPISimulator
```
Then configure parameters of the manisfest.webapp file based on the explanation below
```sh
{
  "launch_path": "simulator.js",
  "default_locale": "en",
  "activities": {
    "SMSAPI": {
      "callbackurl": "http://192.168.1.100:8084", #sparrow callback url from to post sms. this simulate the sending of sms from contact(phone number)
      "token": "wwwwsssscccc", #define the same token with the sms2sparrow channel to allow the communication
      "shortcode": "xxxxx"
    }
  },
  "appType": "APP",
  "smsKeyword": "sms2",
  "simulationMode": "on",
  "supportSpecialCharset": "on",
  "name": "SMS API Simulator",
  "version": "1.0.0",
  "description": "App to simulate External SMS API for RapidPro",
  "developer": {
    "name": "Gerard Bisama"
  }
}
...
```
Apart from the commented params, leave the others as they are.
if the configuration are done,
Install the dependencies, node packages
```sh
npm install
npm start
```
The service is exposed on the port 8085 (this could be changed)

## Service configuration
To use this apps as SMS API Simulator there is a need to configure it as SMS API in the [sms2sparrow config file](https://github.com/gerard-bisama/sms2sparrow#clone-the-app-on-your-host). 
```sh
...
"SMSAPI": {
      "url": ""http://<ip:port>/sms", #the IP of the server and the port:8085 p.ex. this could be run on the same server with sms2sparrow
      "token": "xxxxTokenxxxxxx", #use the same token with the SMS API Simulator
      "shortcode": "xxxxx" # for the simulator 1234 could be used
    },
...
```
##Simulation
To simulate the sending of SMS, go to rapidPro and trigger the flow or send a SMS to a contact.
To simulate the reception of sms (send from contact), in the terminal run the following command
```sh
curl 'http://<sms2sparrrowIP>:<sms2sparrowPort>/getsms?from=+24299900&to=<shortcode>&text=messagetosend'
```

Taratataaa










