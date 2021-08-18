<h1 align="center">DCC Utils</h1>

<div align="center">
<img width="256" height="256" src="img/logo-dcg.png">
</div>

<br />
<div align="center">
    <!-- CoC -->
    <a href="https://github.com/ministero-salute/dcc-utils/blob/master/CODE_OF_CONDUCT.md">
      <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" />
    </a>
    <a href="https://www.npmjs.com/package/dcc-utils">
      <img src="https://img.shields.io/npm/v/dcc-utils.svg?logo=npm" />
    </a>
    <a href="https://github.com/ministero-salute/dcc-utils/actions/workflows/ci.yml">
      <img src="https://github.com/ministero-salute/dcc-utils/actions/workflows/ci.yml/badge.svg" />
    </a>
    <a href="https://codecov.io/gh/ministero-salute/dcc-utils">
      <img src="https://img.shields.io/codecov/c/github/ministero-salute/dcc-utils.svg" />
    </a>
</div>


# Table of contents

- [Context](https://github.com/ministero-salute/dcc-utils#context)
- [Installation](https://github.com/ministero-salute/dcc-utils#installation)
- [Contributing](https://github.com/ministero-salute/dcc-utils#contributing)
  - [Contributors](https://github.com/ministero-salute/dcc-utils#contributors)
- [Licence](https://github.com/ministero-salute/dcc-utils#licence)
  - [Authors / Copyright](https://github.com/ministero-salute/dcc-utils#authors--copyright)
  - [Third-party component licences](https://github.com/ministero-salute/dcc-utils#third-party-component-licences)
  - [Licence details](https://github.com/ministero-salute/dcc-utils#licence-details)


# Context

This NPM package contains a set of utilities to read EU Digital COVID Certificates, verify signatures and rules.

# Installation

```
npm install dcc-utils
```

# Usage

Get a DCC from an image

```js
const { DCC } = require('dcc-utils');

const dcc = await DCC.fromImage('/data/QRCodeDCC.png');
```

or raw data

```js
const dcc = await DCC.fromRaw('HC1:6BF+70790T9WJWG.FKY*4GO0.O1CV2 O5 N2FBBRW1*70HS8WY04AC*WIFN0AHCD8KD97TK0F90KECTHGWJC0FDC:5AIA%G7X+AQB9746HS80:54IBQF60R6$A80X6S1BTYACG6M+9XG8KIAWNA91AY%67092L4WJCT3EHS8XJC$+DXJCCWENF6OF63W5NW6WF6%JC QE/IAYJC5LEW34U3ET7DXC9 QE-ED8%E.JCBECB1A-:8$96646AL60A60S6Q$D.UDRYA 96NF6L/5QW6307KQEPD09WEQDD+Q6TW6FA7C466KCN9E%961A6DL6FA7D46JPCT3E5JDLA7$Q6E464W5TG6..DX%DZJC6/DTZ9 QE5$CB$DA/D JC1/D3Z8WED1ECW.CCWE.Y92OAGY8MY9L+9MPCG/D5 C5IA5N9$PC5$CUZCY$5Y$527B+A4KZNQG5TKOWWD9FL%I8U$F7O2IBM85CWOC%LEZU4R/BXHDAHN 11$CA5MRI:AONFN7091K9FKIGIY%VWSSSU9%01FO2*FTPQ3C3F');
```

See [get_dcc_from_raw_and_image.js](https://github.com/ministero-salute/dcc-utils/blob/master/examples/get_dcc_from_raw_and_image.js) example.

With dcc-utils you can also verify its signature

```js
const verified = await dcc.checkSignature(myVerifier);
if (verified) {
  console.log(dcc.payload);
}
```

See [verify_signature.js](https://github.com/ministero-salute/dcc-utils/blob/master/examples/verify_signature.js), [verify_signature_from_list.js](https://github.com/ministero-salute/dcc-utils/blob/master/examples/verify_signature_from_list.js) and [verify_signature_raw.js](https://github.com/ministero-salute/dcc-utils/blob/master/examples/verify_signature_raw.js) examples. Signature verification uses CoseJS library under the hood, see [CoseJS documentation](https://github.com/erdtman/cose-js) for more details.


With dcc-utils you can evaluate [business rules](https://github.com/ehn-dcc-development/dgc-business-rules) against a DCC

```js
const { DCC, Rule } = require('dcc-utils');

const dcc = await DCC.fromImage('/data/QRCodeDCC.png');
const rule = Rule.fromFile('de_v0001_rule.json', {
  validationClock: new Date().toISOString(),
});

rule.evaluateDCC(dcc)
```

You can also get rules from API

```js
const { DCC, Rule } = require('dcc-utils');

const dcc = await DCC.fromImage('/data/QRCodeDCC.png');
const VR_DE_0001_RULE_URL = "https://dgca-businessrule-service.cfapps.eu10.hana.ondemand.com/rules/de/bc092f8000606c57a8fd80bc7a31ff720a4c4428510d88c774bed2f839c76b66";
const response = await fetch(VR_DE_0001_RULE_URL);
const ruleJSON = await response.json();
const rule = Rule.fromJSON(ruleJSON, {
  validationClock: new Date().toISOString(),
});

rule.evaluateDCC(dcc)
```

See [check_rules.js](https://github.com/ministero-salute/dcc-utils/blob/master/examples/check_rules.js) and [check_rules_from_api.js](https://github.com/ministero-salute/dcc-utils/blob/master/examples/check_rules_from_api.js) examples.

# Contributing
Contributions are most welcome. Before proceeding, please read the [Code of Conduct](https://github.com/ministero-salute/dcc-utils/blob/master/CODE_OF_CONDUCT.md) for guidance on how to approach the community and create a positive environment. Additionally, please read our [CONTRIBUTING](https://github.com/ministero-salute/dcc-utils/blob/master/CONTRIBUTING.md) file, which contains guidance on ensuring a smooth contribution process.

## Contributors
Here is a list of contributors. Thank you to everyone involved for improving this project, day by day.

<a href="https://github.com/ministero-salute/dcc-utils">
  <img
  src="https://contributors-img.web.app/image?repo=ministero-salute/dcc-utils"
  />
</a>

# Licence

## Authors / Copyright

Copyright 2021 (c) Ministero della Salute.

Please check the [AUTHORS](https://github.com/ministero-salute/dcc-utils/blob/master/AUTHORS) file for extended reference.

## Licence details

The licence for this repository is a [GNU Affero General Public Licence version 3](https://www.gnu.org/licenses/agpl-3.0.html) (SPDX: AGPL-3.0). Please see the [LICENSE](https://github.com/ministero-salute/dcc-utils/blob/master/LICENSE) file for full reference.
