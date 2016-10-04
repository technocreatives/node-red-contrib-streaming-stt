module.exports = function(RED) {
  'use strict';

  var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
  var Mic = require('./microphone.js');

  function StreamingStt(config) {
    RED.nodes.createNode(this, config);
    this.cmd = config.cmd;
    var node = this;

    var username = this.credentials.username;
    var password = this.credentials.password;

    var micOption = {};
    micOption.command = node.cmd;
    var mic = new Mic(micOption);
    var speech_to_text= new SpeechToTextV1({
            username: username,
            password: password
          });
    var voice = null;
    var watson = null;

    this.on('input', function(msg) {
      var requestToListen = msg.payload;

      if (requestToListen === undefined) {
        node.warn('Need to specify msg.listening bool property.');
        return;
      }

      if (voice !== null && requestToListen) {
        node.warn('Speech node is already listening, stop before starting a new connection.', msg);
        return;
      }
      switch(requestToListen) {
        case false: {
          mic.stopRecording();
          voice = null;
          if (watson === null)
            return;
          watson.stop();
        }
        return;
        case true: {
          node.status({fill:'yellow',shape:'ring',text:'requesting'});
          voice = mic.startRecording();
          watson = speech_to_text.createRecognizeStream({ content_type: 'audio/l16; rate=44100' });

          watson.on('results', function(data) {
            msg.payload = data;
            node.send([msg,null]);
          }).on('listening',function(){
            node.status({fill:'green',shape:'ring',text:'listening'});
            node.send([null,{payload:'LISTENING'}]);
          }).on('connect', function(){
            node.status({fill:'green',shape:'dot',text:'connected'});
            node.send([null,{payload:'CONNECTED'}]);
          }).on('close', function(reasonCode, description){
            node.log('Closed with code '+reasonCode+', '+description);
            node.status({fill:'yellow',shape:'dot',text:'closed'});
            node.send([null,{payload:'CLOSED'}]);
          }).on('error', function(err){
            node.status({fill:'red',shape:'dot',text:'error'});
            node.send([null,{payload:'ERROR'}]);
          }).on('stopping', function(){
            node.status({fill:'yellow',shape:'ring',text:'stopping'});
            node.send([null,{payload:'STOPPING'}]);
          });

          // pipe your recorded voice to watson sttws
          voice.pipe(watson);
        }
        break;
        default:
        return;
      }
    });

  }

  RED.nodes.registerType('streaming-stt', StreamingStt,{
    credentials: {
      username: {type: 'text'},
      password: {type: 'password'}
    }
  });
};