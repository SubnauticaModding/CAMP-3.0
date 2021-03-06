import express from "express";

console.log("Starting web server...");
const web = express();
web.all("*", (_, res) => {
  res.redirect("https://discord.gg/UpWuWwq");
});
web.listen(process.env.PORT);
console.log("Web server started.");