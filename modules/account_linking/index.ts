import path from "path";
import { importAll } from "../../src/util";

importAll(path.join(__dirname, "./commands"));

export type Account = {
  id: number,
  discord: string,
  nexus: NexusAccount,
  github: string,
};

type NexusAccount = {
  name: string;
  id: string;
}