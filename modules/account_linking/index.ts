import path from "path";
import { importAll } from "../../src/util";

importAll(path.join(__dirname, "./commands"));

export type Account = {
  discord: string[],
  nexus: NexusAccount[],
  github: string[],
};

export type NexusAccount = {
  name: string;
  id: string;
}