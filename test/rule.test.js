const { DCC, Rule } = require('../src');

jest.setTimeout(10000);

describe('Testing Rule', () => {
  test('apply', async () => {
    const dcc = await DCC.fromImage('./test/test_data/valid_certificate.png');
    const rule = Rule.fromFile('./test/test_data/de_v_rule.json');
    expect(rule.evaluateDCC(dcc)).toStrictEqual(true);
  });

  test('get description', async () => {
    const rule = Rule.fromFile('./test/test_data/de_v_rule.json');
    expect(rule.getDescription()).toStrictEqual('The vaccination schedule must be complete (e.g., 1/1, 2/2).');
    expect(rule.getDescription('de')).toStrictEqual('Die Impfreihe muss vollständig sein (z.B. 1/1, 2/2).');
    expect(rule.getDescription('us')).toStrictEqual(null);
  });
});
