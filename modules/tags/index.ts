import path from "path";
import { importAll } from "../../src/util";

importAll(path.join(__dirname, "./commands"));
