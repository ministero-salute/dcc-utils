// Node.js script to refresh the accepted certificates list
const fetch = require('node-fetch');
const { X509Certificate, PublicKey } = require('@peculiar/x509');
const crypto = require('isomorphic-webcrypto');
const fs = require('fs');

const ENDPOINT = 'https://get.dgc.gov.it/v1/dgc/signercertificate';
const OUTFILE = 'examples/data/certificates.json';

async function main() {

  const certs = await loadKeys()
  const contents = JSON.stringify(certs, null, '\t') + '\n';
  await fs.promises.writeFile(OUTFILE, contents);
  const l = Object.values(certs).filter(c => !!c).length
  console.log(`Wrote ${l} certificates to ${OUTFILE}`);
}

async function loadCertificates(resumeToken, keys) {
  const resp = await fetch(`${ENDPOINT}/update`, {
    headers: { 'x-resume-token': `${resumeToken}` }
  });
  if (resp.status === 204) return keys;
  if (resp.status !== 200) throw new Error(`API returned error: ${await resp.text()}`);

  const headers = resp.headers;
  const newResumeToken = headers.get('x-resume-token');
  const kid = headers.get('x-kid');
  const certificate = await resp.text()
  keys[kid] = await parseCert(certificate)
  return loadCertificates(newResumeToken, keys);
}

async function loadKeys() {
  console.log('Loading KIDS...');
  const resp = await fetch(`${ENDPOINT}/status`);
  const kids = await resp.json();
  const keys = kids.reduce((acc, kid) => ({ ...acc, [kid]: null }), {})

  console.log(`${kids.length} KIDS found`);
  console.log('Loading certificates...');
  return await loadCertificates(0, keys)
}

async function parseCert(pem) {
  try {
    return await exportCertificate(pem);
  } catch (err) {
    // The server returns both certificates and raw public keys
    return await exportPublicAsCert(pem);
  }
}

/**
 * @param {string} pem base64-encoded PEM x509 certificate
 * @returns {Promise<import("./src/lib/digital_green_certificate").DSC>}
 */
async function exportCertificate(pem) {
  const x509cert = new X509Certificate(pem);

  // Export the certificate data.
  return {
    serialNumber: x509cert.serialNumber,
    subject: x509cert.subject,
    issuer: x509cert.issuer,
    notBefore: x509cert.notBefore.toISOString(),
    notAfter: x509cert.notAfter.toISOString(),
    signatureAlgorithm: x509cert.signatureAlgorithm.name,
    fingerprint: Buffer.from(await x509cert.getThumbprint(crypto)).toString('hex'),
    ...(await exportPublicKeyInfo(x509cert.publicKey))
  };
}

/**
 * Generate a DSC from a single public key without certificate information
 * @param {string} pem base64-encoded PEM x509 certificate
 * @returns {Promise<import("./src/lib/digital_green_certificate").DSC>}
 */
async function exportPublicAsCert(pem) {
  // Export the certificate data.
  return {
    serialNumber: '',
    subject: 'UNKNOWN',
    issuer: 'UNKNOWN',
    notBefore: '2020-01-01',
    notAfter: '2030-01-01',
    signatureAlgorithm: '',
    fingerprint: '',
    ...(await exportPublicKeyInfo(new PublicKey(pem)))
  };
}

/**
 * @param {PublicKey} pubkey
 * @returns {Promise<{
 * 	publicKeyAlgorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams;
 * 	publicKeyPem: string;
 * }>}
 */
async function exportPublicKeyInfo(publicKey) {
  const public_key = await publicKey.export(crypto);
  const spki = await crypto.subtle.exportKey('spki', public_key);

  // Export the certificate data.
  return {
    publicKeyAlgorithm: public_key.algorithm,
    publicKeyPem: Buffer.from(spki).toString('base64')
  };
}

main();