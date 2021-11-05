const rs = require('jsrsasign');
const rsu = require('jsrsasign-util');
const { DCC } = require('../src');
const {
  ValidTestKeys, ValidWrongKeys, InvalidKeys, EmptyKeys,
} = require('./test_data/sanipasse_format_keys.json');

jest.setTimeout(10000);

describe('Testing DCC', () => {
  test('reading valid certificate from image', async () => {
    const dcc = await DCC.fromImage('./test/test_data/valid_certificate.png');
    expect(dcc.payload.nam.fn).toStrictEqual('Mustermann');
    expect(dcc.raw).toMatch(/HC1:.*/);
  });

  test('reading valid certificate from raw', async () => {
    const dcc = await DCC.fromRaw('HC1:6BF+70790T9WJWG.FKY*4GO0.O1CV2 O5 N2FBBRW1*70HS8WY04AC*WIFN0AHCD8KD97TK0F90KECTHGWJC0FDC:5AIA%G7X+AQB9746HS80:54IBQF60R6$A80X6S1BTYACG6M+9XG8KIAWNA91AY%67092L4WJCT3EHS8XJC$+DXJCCWENF6OF63W5NW6WF6%JC QE/IAYJC5LEW34U3ET7DXC9 QE-ED8%E.JCBECB1A-:8$96646AL60A60S6Q$D.UDRYA 96NF6L/5QW6307KQEPD09WEQDD+Q6TW6FA7C466KCN9E%961A6DL6FA7D46JPCT3E5JDLA7$Q6E464W5TG6..DX%DZJC6/DTZ9 QE5$CB$DA/D JC1/D3Z8WED1ECW.CCWE.Y92OAGY8MY9L+9MPCG/D5 C5IA5N9$PC5$CUZCY$5Y$527B+A4KZNQG5TKOWWD9FL%I8U$F7O2IBM85CWOC%LEZU4R/BXHDAHN 11$CA5MRI:AONFN7091K9FKIGIY%VWSSSU9%01FO2*FTPQ3C3F');
    expect(dcc.payload.nam.fn).toStrictEqual('Mustermann');
  });

  test('reading not valid certificate from raw', async () => {
    await expect(async () => DCC.fromRaw('HC1:NCFOXN%TSMAHN-H/RCMPQ5GE5I00H9GBH3QNAD6.LQLX85ZS GJTSJ4NKP1HCV4*XUA2PSGH.+H$NI4L6F$S-N1FYBRR1$Q1+GOF+P$HQPHQHTQ.SQ6$PUKRN95404.W7UX4795L*KDYPWGO+9AZDOHCRL35IWMSDOP7OQ+M70AK$8 96XY4SBLU96:/6N9R%EPL8RY9DOA60-K.IA.C8KRDL4O54O4IGUJKJGI0JAXD15IAXMFU*GSHGRKMXGG6DBYCBMQN:HG5PAHGG8KES/F-1JW-K%B3A9ENO4B-S-*O4-G1FD/U47HAE1MI4OE0G1:HHD4AB874MM-6B:HKJSQ.TAG3CR1638W9AV88G64PB4VHRY2EK03NFJL4M10KP3AT2VK LT5GGFV85I0*10W2ZXJSBTMFW*+KM2T8-CXR32BMF7RAEAYKMWHE/NH UP4SNGENEWUY97 -3YM0.HAM:D:00ZY35XRT1100MFKWEWYHKCZIZJ0CAQYIKOZIZJ0DAQCDQGAE62ORR7HL0POYQCGMGBBEQFCBCDCT4VYFQZEPYFXK69ZRV9T8IY6NWAYEJF0VXVKNFCG/X9UIG5HFWRPEDW2EPW00S1K83I3900:919FUCKYOUALLGPSUPPORTERS9IKM24N21AW7ZUR2L013300EUISGOEINGDOWNNAZZYFUCKERS666I3AK96XYR01300STOREMYCODEMUTHERFUCKERANDGOTOHELLI5340XRT09SHUZVB33IR0IPUTAVIRUSHERE83H73KFI280I23KL0YRZT91Y0WITHLOVEFROMHA1*PWEOXCI/QXRLOZKN0LM*03I2RWT0Z'))
      .rejects
      .toThrow('Invalid base45 string');
  });

  test('reading not valid certificate', async () => {
    await expect(async () => DCC.fromImage('./test/test_data/not_valid_certificate.png'))
      .rejects
      .toThrow('incorrect header check');
  });

  test('verify signature', async () => {
    const dcc = await DCC.fromImage('./test/test_data/signed_cert.png');
    const crt = rsu.readFile('./test/test_data/signing_certificate.crt');
    const verifier = rs.KEYUTIL.getKey(crt).getPublicKeyXYHex();
    let verified = await dcc.checkSignature(verifier);
    expect(verified).not.toBeNull();
    verified = await dcc.checkSignatureWithCertificate(crt);
    expect(verified).not.toBeNull();
  });

  test('verify signature RSA', async () => {
    const dcc = await DCC.fromImage('./test/test_data/valid_ch_certificate.png');
    const crt = rsu.readFile('./test/test_data/cert_rsa.crt');
    const verified = await dcc.checkSignatureWithCertificate(crt);
    expect(verified).not.toBeNull();
  });

  test('verify signature not supported certificate', async () => {
    const dcc = await DCC.fromImage('./test/test_data/valid_ch_certificate.png');
    const crt = rsu.readFile('./test/test_data/512b-dsa-example-cert.pem');
    await expect(async () => dcc.checkSignatureWithCertificate(crt))
      .rejects
      .toThrow('Certificate not supported');
  });

  test('verify wrong signature throws an exception', async () => {
    const dcc = await DCC.fromImage('./test/test_data/signed_cert.png');
    const crt = rsu.readFile('./test/test_data/wrong_signing_certificate.crt');
    const verifier = rs.KEYUTIL.getKey(crt).getPublicKeyXYHex();
    await expect(async () => dcc.checkSignature(verifier))
      .rejects
      .toThrow('Signature missmatch');
    await expect(async () => dcc.checkSignatureWithCertificate(crt))
      .rejects
      .toThrow('Signature missmatch');
  });

  /* verify signature from list v2 */

  test('verify from list v2, valid from test-list', async () => {
    const dcc = await DCC.fromImage('./test/test_data/signed_with_italian_test_key.png');
    const authority = await dcc.checkSignatureWithKeysList(ValidTestKeys);
    expect(authority).not.toBeNull();
    expect(authority.issuer).toStrictEqual('C=IT, O=Ministero della Salute, CN=Italy DGC CSCA 1');
  });

  test('verify from list v2, unlisted key', async () => {
    const dcc = await DCC.fromImage('./test/test_data/signed_with_italian_test_key.png');
    const verify = async () => dcc.checkSignatureWithKeysList(EmptyKeys);
    await expect(verify())
      .rejects
      .toThrow('Cannot verify signature: the key that signed the certificate is not listed');
  });

  test('verify from list v2, invalid signature', async () => {
    const dcc = await DCC.fromImage('./test/test_data/signed_with_italian_test_key.png');
    const verify = await dcc.checkSignatureWithKeysList(ValidWrongKeys);
    await expect(verify).toBeFalsy();
  });

  test('verify from list v2, generic error', async () => {
    const dcc = await DCC.fromImage('./test/test_data/signed_with_italian_test_key.png');
    const verify = async () => dcc.checkSignatureWithKeysList(InvalidKeys);
    await expect(verify())
      .rejects
      .toThrow('Data does not match to PublicKeyInfo ASN1 schema. ');
  });
});
