const express = require('express');
const helmet = require('helmet');
const https = require("https");
const path = require('path');
const fs = require("fs");

const app = express();

app.use(helmet());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  console.log(`🚀 Client ready at https://ftth.safaricom.co.ke:8000`);
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// prod values
// const options = {
//   key: fs.readFileSync('/opt/ssl/ftth.key'),
//   cert: fs.readFileSync('/opt/ssl/ftth.cer'),
//   passphrase: 'cisco123'
// };

// UAT values
// const options = {
//   key: fs.readFileSync('/opt/ssl/private.key'),
//   cert: fs.readFileSync('/opt/ssl/svdt1homeuat01.cer'),
// };

// port for prod otherwise use :3000 for UAT
app.listen(8000); //Without HTTPS
// https.createServer(options, app).listen(8000);
