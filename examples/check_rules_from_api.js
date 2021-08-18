const { DCC, Rule } = require('../src');
const fetch = require('node-fetch');

const main = async function () {
  const valueSets = require('./data/valueSets.json');
  const dcc = await DCC.fromImage('./data/2.png');
  const VR_DE_0001_RULE_URL = "https://dgca-businessrule-service.cfapps.eu10.hana.ondemand.com/rules/de/bc092f8000606c57a8fd80bc7a31ff720a4c4428510d88c774bed2f839c76b66";
  const response = await fetch(VR_DE_0001_RULE_URL);
  const ruleJSON = await response.json();
  const rule = Rule.fromJSON(
    ruleJSON,
    {
      valueSets,
      validationClock: new Date().toISOString(),
    },
  );
  const result = await rule.evaluateDCC(dcc);
  if (result === false) {
    console.log(rule.getDescription());
    console.log(`This certificate has ${dcc.payload.v[0].dn}/${dcc.payload.v[0].sd}.`);
  }
};

main();
