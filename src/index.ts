import { addPath, getInput, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { cacheFile, downloadTool, extractZip } from '@actions/tool-cache';

import { CLI_NAME, VERSION } from './constants';
import { getBinaryPath, getDownloadUrl } from './utils';

export async function run() {
  try {
    // Get the version of the tool to be installed
    const version = getInput('butler-version') || VERSION;
    const name = getInput('cli-name') || CLI_NAME;

    // Download the specific version of the tool (e.g., tarball/zipball)
    const downloadUrl = getDownloadUrl(version);
    const pathToTarball = await downloadTool(downloadUrl);

    // Extract the tarball/zipball onto the host runner
    const extractDirectory = await extractZip(pathToTarball);

    // Rename the binary
    const binaryPath = getBinaryPath(extractDirectory, name);
    if (name !== CLI_NAME) {
      await exec('mv', [getBinaryPath(extractDirectory, CLI_NAME), binaryPath]);
    }

    // Cache the tool
    await cacheFile(binaryPath, name, name, version);

    // Expose the tool by adding it to the PATH
    addPath(extractDirectory);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
