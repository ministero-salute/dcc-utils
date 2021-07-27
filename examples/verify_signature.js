const rs = require('jsrsasign');
const rsu = require('jsrsasign-util');
const { DCC } = require('../src');

const main = async function () {
  const dcc = await DCC.fromImage('./data/signed_cert.png');
  const crt = rsu.readFile('./data/signing_certificate.crt');
  const verifier = rs.KEYUTIL.getKey(crt).getPublicKeyXYHex();

  const verified = await dcc.checkSignature(verifier);
  if (verified) {
    console.log(dcc.payload);
  }
};

main();
