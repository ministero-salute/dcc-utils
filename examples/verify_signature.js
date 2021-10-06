/*
* Example data taken from  
* https://dgc.a-sit.at/ehn/
*/

const rs = require('jsrsasign');
const rsu = require('jsrsasign-util');
const { DCC } = require('../src');

const main = async function () {
  const dcc = await DCC.fromImage('./data/signed_cert.png');
  const crt = rsu.readFile('./data/signing_certificate.crt');
  const verified = await dcc.checkSignatureWithCertificate(crt);
  if (verified) {
    console.log(dcc.payload);
  }
};

main();
