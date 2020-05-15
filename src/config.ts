import all from "../config/all.json"
import development from "../config/development.json";
import production from "../config/production.json";

var environment: { environment: "development" | "production" } = {
  environment: "development",
};

if ((process.argv[2] || "production") == "development") {
  var config = {
    ...all,
    ...development,
    ...environment,
  };
}
else {
  environment.environment = "production";
  var config = {
    ...all,
    ...production,
    ...environment,
  }
}

export default config;