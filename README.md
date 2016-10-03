node-red-contrib-streaming-stt
==============================
<a href="http://nodered.org" target="_new">Node-RED</a> node for IBM Watsons <a href="https://www.ibm.com/watson/developercloud/speech-to-text.html" target="_new">streaming speech-to-text api</a>.

Install
-------
Run the following command in your Node-RED user directory - typically `~/.node-red`

        npm install node-red-contrib-streaming-stt

Usage
-----
You will need to register an <a href ="http://www.ibm.com/cloud-computing/bluemix/" target="_new">IBM Bluemix</a> account and add the Speech To Text service to create the required credentials. Then enter these credentials while configuring the node.

Acknowledgements
==============================

Uses a modified version of <a href="https://github.com/MexXxo/node-microphone" target="_new">microphone lib</a>. Added it as code instead of a dependency due to a bug that made the lib not work in macOS.