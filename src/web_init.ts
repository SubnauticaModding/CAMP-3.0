import express from "express";

import config from "./config";

export default function () {
  console.log("Starting web server...");
  const web = express();
  web.all("*", (_, res) => {
    res.redirect(config.invite);
  });
  web.listen(process.env.PORT);
  console.log("Web server started.");
}