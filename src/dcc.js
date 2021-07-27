const fs = require('fs');
const zlib = require('zlib');

const Jimp = require('jimp');
const jsQR = require('jsqr');
const base45 = require('base45');
const cbor = require('cbor');
const cose = require('cose-js');

class DCC {
  static async fromRaw(certificateRaw) {
    const dcc = new DCC();
    dcc._raw = certificateRaw;
    const base45Data = base45.decode(certificateRaw.slice(4));
    dcc._coseRaw = zlib.inflateSync(base45Data);
    const cborPayload = cbor.decodeFirstSync(dcc._coseRaw).value[2];
    const jsonCBOR = cbor.decodeFirstSync(cborPayload);
    dcc._payload = jsonCBOR.get(-260).get(1);
    return dcc;
  }

  static async fromImage(certificateImagePath) {
    const buffer = fs.readFileSync(certificateImagePath);
    const image = await Jimp.read(buffer);
    const code = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height);
    return DCC.fromRaw(code.data);
  }

  get raw() {
    return this._raw;
  }

  get payload() {
    return this._payload;
  }

  async checkSignature(signatureKey) {
    const verifier = {
      key: signatureKey,
    };
    return cose.sign.verify(this._coseRaw, verifier);
  }
}

module.exports = DCC;
