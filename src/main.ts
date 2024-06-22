import * as core from "@actions/core";

async function run() {
  try {
    const prefix = core.getInput("prefix");
    const suffix = core.getInput("suffix");

    const targetVersion = "1.2.3";
    core.setOutput("version", targetVersion);
    core.setOutput("version-ext", targetVersion + suffix);
    core.setOutput("version-full", prefix + targetVersion + suffix);

  } catch (error) {
    core.setFailed(`${error}`);
  }
}

run();
