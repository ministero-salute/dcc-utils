import {DCC} from "./";

declare class Rule {
  static fromFile(filePath: string | Buffer | URL, external?: Record<string, any>): Rule;

  static fromJSON(ruleJSON: Record<string, any>, external?: Record<string, any>): Rule;

  get payload(): Record<string, any>;

  getDescription(language?: string): string | null;

  evaluateDCC(dcc: DCC, external?: Record<string, any>): any;
}

export {Rule}
