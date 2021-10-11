import { Recovery, Test, Vaccine } from "./";

/**
 * The shape of the payload of a GP
 */
export interface DCCPayload {
  dob: string;
  nam: {
    fn: string;
    fnt: string;
    gn: string;
    gnt: string;
  };
  r?: Recovery[];
  t?: Test[];
  v?: Vaccine[];
  ver: string;
}
