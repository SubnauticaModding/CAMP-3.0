import path from "path";
import { importAll } from "../../src/util";
import ModIdea from "./src/mod_idea";

importAll(path.join(__dirname, "./events"));

setInterval(() => {
  ModIdea.updateReportMessage();
  ModIdea.removeBadIdeas();
}, 60000); // 1 minute