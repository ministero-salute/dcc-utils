// Original source code: https://github.com/irony/base45
// Original author: Christian Landgren (https://github.com/irony)
// base45 is available under the MIT license.
// Modified by Andrea Stagi

const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
const divmod = (x, y) => [Math.floor(x / y), x % y];

// Encode a buffer (or uint8array) to base45-encoded string
const encode = (buffer) => {
  if (typeof (buffer) === 'string') buffer = Buffer.from(buffer);
  let res = '';
  for (let i = 0; i < buffer.length; i += 2) {
    if (buffer.length - i > 1) {
      const x = (buffer[i] << 8) + buffer[i + 1];
      const [e, rest] = divmod(x, 45 * 45);
      const [d, c] = divmod(rest, 45);
      res += charset[c] + charset[d] + charset[e];
    } else {
      const [d, c] = divmod(buffer[i], 45);
      res += charset[c] + charset[d];
    }
  }
  return res;
};

// Decode base45-encoded input
const decode = (input) => {
  const buffer = Array.from(input).map((c) => charset.indexOf(c));
  const res = [];
  for (let i = 0; i < buffer.length; i += 3) {
    if (buffer.length - i >= 3) {
      const x = buffer[i] + buffer[i + 1] * 45 + buffer[i + 2] * 45 * 45;
      if (x > 0xFFFF) {
        throw new Error('Invalid base45 string');
      }
      res.push(...divmod(x, 256));
    } else {
      const x = buffer[i] + buffer[i + 1] * 45;
      if (x > 0xFF) {
        throw new Error('Invalid base45 string');
      }
      res.push(x);
    }
  }
  return Buffer.from(res);
};

module.exports = {
  encode,
  decode,
};
