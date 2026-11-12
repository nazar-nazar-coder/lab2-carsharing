const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith(".js")) files.push(full);
  }
  return files;
}

const files = [...walk("frontend"), ...walk("services")];
for (const file of files) {
  execFileSync(process.execPath, ["--check", file]);
}
console.log("Syntax check passed");
