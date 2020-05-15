import all from "../config/all.json"
import development from "../config/development.json";
import production from "../config/production.json";

var environment: { environment: "development" | "production" } = {
  environment: "development",
};

if (process.env.NODE_ENV == "dev") {
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