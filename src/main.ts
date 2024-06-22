import * as core from "@actions/core";
import { readFileSync } from "fs";
import { parse } from "toml";

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
      // check if Cargo.toml exists
      // if it does, extract version from it
      // if it doesn't, throw error

      const path = process.env.GITHUB_WORKSPACE + "/Cargo.toml";
      console.log(`Checking if ${path} exists`);
      const cargoTomlData = readFileSync(path, "utf8");
      const data = parse(cargoTomlData);
      // Extract the package version
      const packageVersion = data.package && data.package.version;

      if (packageVersion) {
        console.log(
          `Package version extracted from Cargo.toml: ${packageVersion}`,
        );
      } else {
        throw new Error(
          `Failed to extract version from GITHUB_REF: ${process.env.GITHUB_REF} or Cargo.toml`,
        );
      }

      throw new Error(
        `Failed to extract version from GITHUB_REF: ${process.env.GITHUB_REF}`,
      );
    } else {
      console.log(`Version extracted from GITHUB_REF: ${version}`);
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
