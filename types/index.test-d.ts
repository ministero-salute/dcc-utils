import { expectType } from 'tsd'
import { DCC, Rule } from "./";

expectType<Promise<DCC>>(DCC.fromRaw('test'))
expectType<Promise<DCC>>(DCC.fromImage('path'))
expectType<Rule>(Rule.fromJSON({}))
expectType<Rule>(Rule.fromFile('path'))
