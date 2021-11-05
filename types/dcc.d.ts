import { DCCPayload } from "./models";

declare class DCC {
  static fromRaw(certificateRaw: string): Promise<DCC>;

  static fromImage(certificateImagePath: string | Buffer | URL): Promise<DCC>;

  get raw(): string;

  get kid(): string;

  get payload(): DCCPayload;

  checkSignature(signatureKey: { x: string | Buffer, y: string | Buffer, kid?: string | Buffer }): Promise<Buffer>;

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

export { DCC, DCCPayload }
