var child = require("child_process");
var os = require("os");

switch (os.type()) {
  case "Windows_NT":
    child.exec("cd dist && del /s *.js", log);
    child.exec("cd dist && del /s *.js.map", log);
    break;
  case "Linux":
    child.exec("cd dist && find . -name \"*.js\" -type f", log); // TODO: Make sure this works.
    child.exec("cd dist && find . -name \"*.js.map\" -type f", log);
    child.exec("cd dist && find . -name \"*.js\" -type f -delete", log);
    child.exec("cd dist && find . -name \"*.js.map\" -type f -delete", log);
    break;
  default:
    throw Error("Unsupported OS found: " + os.type());
}

/**
 * @param {child.ExecException} error 
 * @param {string} stdout 
 * @param {string} stderr 
 */
function log(error, stdout, stderr) {
  if (error) console.error(error);
  if (stderr) console.log(stderr);
  if (stdout) console.log(stdout);
}