const fs = require('fs');
const { DCC, Rule } = require('../src');

jest.setTimeout(10000);

describe('Testing Rule', () => {
  test('apply', async () => {
    const dcc = await DCC.fromImage('./test/test_data/valid_certificate.png');
    const rule = Rule.fromFile('./test/test_data/de_v_rule.json');
    expect(rule.evaluateDCC(dcc)).toStrictEqual(true);
  });

  test('apply from JSON', async () => {
    const dcc = await DCC.fromImage('./test/test_data/valid_certificate.png');
    const ruleJSON = JSON.parse(fs.readFileSync('./test/test_data/de_v_rule.json'));
    const rule = Rule.fromJSON(ruleJSON);
    expect(rule.evaluateDCC(dcc)).toStrictEqual(true);
  });

  test('out of time', async () => {
    const dcc = await DCC.fromImage('./test/test_data/valid_certificate.png');
    const rule = Rule.fromFile('./test/test_data/de_v_rule_2.json', {
      validationClock: new Date('2022-10-10').toISOString(),
    });
    expect(rule.evaluateDCC(dcc)).toStrictEqual(false);
  });

  test('get description', async () => {
    const rule = Rule.fromFile('./test/test_data/de_v_rule.json');
    expect(rule.getDescription()).toStrictEqual('The vaccination schedule must be complete (e.g., 1/1, 2/2).');
    expect(rule.getDescription('de')).toStrictEqual('Die Impfreihe muss vollständig sein (z.B. 1/1, 2/2).');
    expect(rule.getDescription('us')).toStrictEqual(null);
  });
});
