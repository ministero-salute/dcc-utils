/*
* Trust list taken from sanipasse by lovasoa
* https://github.com/lovasoa/sanipasse/
*
* Keys list by lovasoa, available:
* https://raw.githubusercontent.com/lovasoa/sanipasse/master/src/assets/Digital_Green_Certificate_Signing_Keys.json
* ALERT: an official API would be needed
*
* Test keys list and test-qr-code by italian dcc team, file "test 1"
* https://github.com/eu-digital-green-certificates/dgc-testdata/tree/main/IT
*/

const { DCC } = require('../src');

// eslint-disable-next-line no-unused-vars
const keys = require('./data/Digital_Green_Certificate_Signing_Keys.json');
const testkeys = require('./data/It_Test_Signing_Keys.json');

const main = async function () {
  const itTestQr = 'HC1:6BFOXN%TS3DH0YOJ58S S-W5HDC *M0II5XHC9B5G2+$N IOP-IA%NFQGRJPC%OQHIZC4.OI1RM8ZA.A5:S9MKN4NN3F85QNCY0O%0VZ001HOC9JU0D0HT0HB2PL/IB*09B9LW4T*8+DCMH0LDK2%K:XFE70*LP$V25$0Q:J:4MO1P0%0L0HD+9E/HY+4J6TH48S%4K.GJ2PT3QY:GQ3TE2I+-CPHN6D7LLK*2HG%89UV-0LZ 2ZJJ524-LH/CJTK96L6SR9MU9DHGZ%P WUQRENS431T1XCNCF+47AY0-IFO0500TGPN8F5G.41Q2E4T8ALW.INSV$ 07UV5SR+BNQHNML7 /KD3TU 4V*CAT3ZGLQMI/XI%ZJNSBBXK2:UG%UJMI:TU+MMPZ5$/PMX19UE:-PSR3/$NU44CBE6DQ3D7B0FBOFX0DV2DGMB$YPF62I$60/F$Z2I6IFX21XNI-LM%3/DF/U6Z9FEOJVRLVW6K$UG+BKK57:1+D10%4K83F+1VWD1NE';

  const dcc = await DCC.fromRaw(itTestQr);

  // use keys for real certificate,
  // use testkeys to validate italian test data
  const certificate = await dcc.checkSignatureWithKeysList(testkeys);
  if (!certificate) {
    console.log('Invalid pass!');
  } else {
    console.log('Validly signed by', certificate);
    // now check notBefore and validAfter
  }
};

main();
