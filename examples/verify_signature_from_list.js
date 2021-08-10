/*
* Example data taken from covid-pass-verifier by Csongor Bokay 
* https://github.com/bcsongor/covid-pass-verifier
*/

const fetch = require('node-fetch');
const { DCC } = require('../src');

const main = async function () {
  const TRUST_LIST_URL = 'https://raw.githubusercontent.com/bcsongor/covid-pass-verifier/35336fd3c0ff969b5b4784d7763c64ead6305615/src/data/certificates.json';
  const response = await fetch(TRUST_LIST_URL);
  const signatures = await response.json();
  const dcc = await DCC.fromImage('./data/2.png');
  for (signature of signatures) {
    if (signature.pub) {
      try {
        const verified = await dcc.checkSignature({
          x: Buffer.from(signature.pub.x),
          y: Buffer.from(signature.pub.y),
          kid: Buffer.from(signature.kid),
        });
        if (verified) {
          console.log(dcc.payload);
          break;
        }
      } catch {}
    }
  }
};

main();
