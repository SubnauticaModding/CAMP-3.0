import path from "path";
import { importAll } from "../../src/util";

importAll(path.join(__dirname, "./commands"));

export type Account = {
  discord: string | string[] | undefined,
  nexus: NexusAccount | NexusAccount[] | undefined,
  github: string | string[] | undefined,
  bitbucket: string | string[] | undefined,
};

export type NexusAccount = {
  name: string;
  id: string;
}