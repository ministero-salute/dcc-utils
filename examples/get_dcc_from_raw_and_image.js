/*
* Example data taken from NHSX 
* https://github.com/nhsx/covid-pass-verifier/tree/main/Documentation/Examples
*/

const { DCC } = require('../src');

DCC.fromImage('./data/example_qr_vaccine_recovery.png').then((dcc) => {
  console.log(dcc.payload)
  console.log(dcc.raw)
})

DCC.fromRaw('HC1:6BFOXN TSMAHN-H1.OG:MR8E2*ORX4QF9W*9OJAU/ILCFHXKN*GMW6SA3/-2E%5UR5+VBJZI+EBXZ2G*S2U2V8TQEDK8C23T6VC-8D2VCGKDD8C:DC-JCG.S$*T+HC+330OK*NI WJUQ6395NZ52HPPEPHCRBK80EQ-B5CS2ISMBPKYYM775TWASEQAC5K87H8Q-9BSV40 7+P4S057Q4UYQD*O%+Q.SQBDO4A7E:7LYPDTQBK8/DOPCRVE4L/5R3FMIA8/BKWNL3C9QD9JA$.B4RDITKOKE/*BYSASA7T5MFF4F0JEYI1DLZZL162L9E$YQC$H- V21SKZEH$5* V/1R.27ZPNJ0KPQ2YVA4AKC923RTPYQ$LB..2S0A33M.%IKOMR84LNO3MQPSL60CL5F*X0E5EVLB RMNV61DH62D').then((dcc) => {
  console.log(dcc.payload)
  console.log(dcc.raw)
})
