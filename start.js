const forever = require('forever-monitor');
const SENDEMAIL = require('./lib/email')
//const send_email = SENDEMAIL()
const moment = require('moment')

  var child = new (forever.Monitor)('exchange.js', {
    append: true,
    silent: false,    
    logFile:"/home/server-hit/log_sms2app/forever.log",
    outFile: "/home/server-hit/log_sms2app/sms2.log",
    errFile: "/home/server-hit/log_sms2app/sms2_error.log",
    command: 'node --max_old_space_size=2000',
    args: []
  });

  child.on('restart', function () {
    console.log('exchange.js has been started on port 8084');
    var time = moment().format()
    SENDEMAIL.sendEmail("SMS2 app started","The middleware was started on "+ time,()=>{

    })
  });

  child.on('exit', function () {
    console.log('Exchange js has stoped');
    var time = moment().format()
   SENDEMAIL.sendEmail("SMS2 app stoped","The middleware was stopped on "+ time,()=>{

    })
  });

  child.start();
