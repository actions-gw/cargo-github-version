import * as core from "@actions/core";


function extractSemver(ref) {
  const semverRegex = /v?(\d+\.\d+\.\d+)/;
  const match = ref.match(semverRegex);
  return match ? match[1] : null;
}


async function run() {
  try {
    const prefix = core.getInput("prefix");
    const suffix = core.getInput("suffix");

    // extract version from github ref

    // refs/tags/v1.2.3

    const version = extractSemver(process.env.GITHUB_REF);
    if (!version) {
      throw new Error(`Failed to extract version from GITHUB_REF: ${process.env.GITHUB_REF}`);
    }

    console.log(`version=${version}`);
    console.log(`version-ext=${version + suffix}`);
    console.log(`version-full=${prefix + version + suffix}`);

    core.setOutput("version", version);
    core.setOutput("version-ext", version + suffix);
    core.setOutput("version-full", prefix + version + suffix);

  } catch (error) {
    core.setFailed(`${error}`);
  }
}

run();
