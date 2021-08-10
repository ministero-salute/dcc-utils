/*
* Example data taken from NHSX 
* https://github.com/nhsx/covid-pass-verifier/tree/main/Documentation/Examples
*/

const rs = require('jsrsasign');
const { DCC } = require('../src');

const main = async function () {
  const dcc = await DCC.fromImage('./data/uk_qr_vaccine_dose1.png');
  const pk = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAELiiJ+fWqqFAJ7gZny/UQV4LgLOdJNpIOFFnLEpSRIBVcKsu+d6E44Z6yWxP9C9RCAk0ibDs9EfJ2aTfgzXxXVQ==";
  const verifier = rs.KEYUTIL.getKey(rs.b64utohex(pk), null, "pkcs8pub").getPublicKeyXYHex();
  const verified = await dcc.checkSignature(verifier);
  if (verified) {
    console.log(dcc.payload);
  }
};

main();
