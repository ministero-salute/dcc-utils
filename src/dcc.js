const fs = require('fs');
const zlib = require('zlib');

const Jimp = require('jimp');
const jsQR = require('jsqr');
const base45 = require('base45');
const cbor = require('cbor');
const cose = require('cose-js');
const { verify, webcrypto, SignatureMismatchError } = require('cosette/build/sign');

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

  /**
   *
   * @param keys associative array of keys, [kid => {key}]
   * @returns {Promise<boolean|*>} return a promise, if the certificate is validly signed with
   * a listed key, return the key with infos about authority that signed it. If the certificate
   * is not validly signed, return false. If the keys is not in list, throw Error.
   */
  async checkSignatureWithKeysList(keys) {
    try {
      let cert;
      await verify(this._coseRaw, async (kid) => {
        cert = keys[kid.toString('base64')];
        return {
          key: await webcrypto.subtle.importKey(
            'spki',
            Buffer.from(cert.publicKeyPem, 'base64'),
            cert.publicKeyAlgorithm,
            true, ['verify'],
          ),
        };
      });
      return cert;
    } catch (e) {
      if (e instanceof SignatureMismatchError) {
        return false;
      }
      if (e.message === 'Cannot read property \'publicKeyPem\' of undefined') {
        throw new Error('Cannot verify signature: the key that signed the certificate is not listed',
          { cause: e });
      }
      throw e;
    }
  }
}

module.exports = DCC;
