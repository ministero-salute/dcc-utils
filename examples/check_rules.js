const { DCC, Rule } = require('../src');

const main = async function () {
  const valueSets = require('./data/valueSets.json');
  const dcc = await DCC.fromImage('./data/2.png');
  const rule = Rule.fromFile(
    './data/de_v_rule.json',
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
