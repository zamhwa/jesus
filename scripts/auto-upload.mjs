import { execSync } from "node:child_process";

function run(command, options = {}) {
  return execSync(command, {
    stdio: "pipe",
    encoding: "utf8",
    ...options
  }).trim();
}

function runStreaming(command) {
  execSync(command, { stdio: "inherit", encoding: "utf8" });
}

function main() {
  try {
    const branch = run("git rev-parse --abbrev-ref HEAD");
    const status = run("git status --porcelain");

    if (!status) {
      console.log("No changes to upload.");
      return;
    }

    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const message = `Auto upload content update (${stamp})`;

    runStreaming("git add .");
    runStreaming(`git commit -m "${message}"`);
    runStreaming(`git push origin ${branch}`);

    console.log(`Uploaded to origin/${branch}`);
  } catch (error) {
    const stderr = error?.stderr?.toString?.() || "";
    const stdout = error?.stdout?.toString?.() || "";
    console.error("Auto upload failed.");
    if (stdout) console.error(stdout);
    if (stderr) console.error(stderr);
    process.exit(1);
  }
}

main();
