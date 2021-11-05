const fs = require('fs');
const zlib = require('zlib');

const Jimp = require('jimp');
const jsQR = require('jsqr');
const base45 = require('base45');
const cbor = require('cbor');
const cose = require('cose-js');
const coseCommon = require('cose-js/lib/common');
const rs = require('jsrsasign');
const { verify, webcrypto, SignatureMismatchError } = require('cosette/build/sign');

class DCC {
  static async fromRaw(certificateRaw) {
    const dcc = new DCC();
    dcc._raw = certificateRaw;
    const base45Data = base45.decode(certificateRaw.slice(4));
    dcc._coseRaw = zlib.inflateSync(base45Data);
    const messageObject = cbor.decodeFirstSync(dcc._coseRaw);
    const protectedHeader = messageObject.value[0];
    const unprotectedHeader = messageObject.value[1];
    const cborPayload = messageObject.value[2];
    const jsonCBOR = cbor.decodeFirstSync(cborPayload);
    dcc._payload = jsonCBOR.get(-260).get(1);
    let kid = cbor.decodeFirstSync(protectedHeader).get(coseCommon.HeaderParameters.kid);
    if (kid === undefined) kid = unprotectedHeader.get(coseCommon.HeaderParameters.kid);
    dcc._kid = Buffer.from(kid).toString('base64');
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

  get kid() {
    return this._kid;
  }

  async checkSignature(signatureKey) {
    const verifier = {
      key: signatureKey,
    };
    return cose.sign.verify(this._coseRaw, verifier);
  }

  async checkSignatureWithCertificate(certificate) {
    const key = rs.KEYUTIL.getKey(certificate);
    let verifier;
    if (key.type === 'EC') {
      verifier = key.getPublicKeyXYHex();
    } else if (key.type === 'RSA') {
      const jwk = rs.KEYUTIL.getJWKFromKey(key);
      verifier = {
        n: Buffer.from(jwk.n, 'base64'),
        e: Buffer.from(jwk.e, 'base64'),
      };
    } else {
      throw new Error('Certificate not supported');
    }
    return cose.sign.verify(this._coseRaw, { key: verifier });
  }

  /**
   *
   * @param keys associative array of keys, [kid => {key}]
   * @returns {Promise<boolean|*>} return a promise, if the certificate is validly signed with
   * a listed key, return the key with infos about authority that signed it. If the certificate
   * is not validly signed, return false. If the keys is not in list, throw Error.
   */
  async checkSignatureWithKeysList(keys) {
    let cert;
    try {
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
      if (typeof cert === 'undefined') {
        throw new Error('Cannot verify signature: the key that signed the certificate is not listed',
          { cause: e });
      }
      throw e;
    }
  }
}

module.exports = DCC;
