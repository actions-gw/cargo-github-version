import * as core from "@actions/core";
import { readFileSync } from "fs";
import { parse } from "toml";

function extractSemver(ref) {
  const semverRegex = /v?(\d+\.\d+\.\d+)/;
  const match = ref.match(semverRegex);
  return match ? match[1] : null;
}

function extractFromCargoToml() {
  const path = process.env.GITHUB_WORKSPACE + "/Cargo.toml";
  const cargoTomlData = readFileSync(path, "utf8");
  const data = parse(cargoTomlData);
  // Extract the package version
  const packageVersion = data.package && data.package.version;

  if (packageVersion) {
    console.log(`Package version extracted from Cargo.toml: ${packageVersion}`);
  } else {
    throw new Error(
      `Failed to extract version from Cargo.toml, check Cargo.toml file for validity`,
    );
  }
  return packageVersion;
}

async function run() {
  try {
    const prefix = core.getInput("prefix");
    const suffix = core.getInput("suffix");

    // extract version from github ref

    // refs/tags/v1.2.3

    const versionFromRef = extractSemver(process.env.GITHUB_REF);
    const versionFromCargoToml = extractFromCargoToml();
    if (versionFromRef && versionFromRef !== versionFromCargoToml) {
      throw new Error(
        `Version extracted from GITHUB_REF: ${versionFromRef} and Cargo.toml: ${versionFromCargoToml} are different`,
      );
    }

    let targetVersion = versionFromCargoToml;
    let targetSuffix = suffix;
    let targetPrefix = prefix;
    if (versionFromRef) {
      targetSuffix = process.env.GITHUB_REF?.split(versionFromRef)[1] || "";
      targetPrefix =
        (process.env.GITHUB_REF?.split(versionFromRef)[0] || "")
          .split("/")
          .pop() || "";
    }

    console.log(`version=${targetVersion}`);
    console.log(`version-ext=${targetVersion + targetSuffix}`);
    console.log(`version-full=${targetPrefix + targetVersion + targetSuffix}`);

    core.setOutput("version", targetVersion);
    core.setOutput("version-ext", targetVersion + targetSuffix);
    core.setOutput("version-full", targetPrefix + targetVersion + targetSuffix);
  } catch (error) {
    core.setFailed(`${error}`);
  }
}

run();
