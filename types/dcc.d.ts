import { DCCPayload } from "./models";

export = DCC;

declare class DCC {
  static fromRaw(certificateRaw: string): Promise<DCC>;

  static fromImage(certificateImagePath: string | Buffer | URL): Promise<DCC>;

  static get raw(): string;

  static get payload(): DCCPayload;

  checkSignature(signatureKey: { x: Buffer, y: Buffer, kid?: Buffer }): Promise<Buffer>;

  checkSignatureWithCertificate(certificate: Buffer): Promise<Buffer>;

  /**
   *
   * @param keys associative array of keys, [kid => {key}]
   * @returns {Promise<boolean|*>} return a promise, if the certificate is validly signed with
   * a listed key, return the key with infos about authority that signed it. If the certificate
   * is not validly signed, return false. If the keys is not in list, throw Error.
   */
  checkSignatureWithKeysList(keys: Record<string, any>): Promise<boolean | any>;
}
