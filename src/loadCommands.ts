import read from "fs-readdir-recursive";
import { join as path } from "path";
import { commands } from "..";

export default function() {
  const files = read(path(__dirname, "commands")).filter((f) => f.endsWith(".ts"));

  for (const f of files) {
    const props = require(path(__dirname, "commands", f));
    commands[f.substring(0, f.length - 3)] = props;
  }
}
