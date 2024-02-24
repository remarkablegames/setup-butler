import { addPath, getInput, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import {
  cacheFile,
  downloadTool,
  extractTar,
  extractZip,
} from '@actions/tool-cache';
import path from 'path';

import { CLI_NAME, VERSION } from './constants';
import { getBinaryPath, getDownloadObject } from './utils';

export async function run() {
  try {
    // Get the version of the tool to be installed
    const version = getInput('cli-version') || VERSION;
    const name = getInput('cli-name') || CLI_NAME;

    // Download the specific version of the tool (e.g., tarball/zipball)
    const download = getDownloadObject(version);
    const pathToTarball = await downloadTool(download.url);

    // Extract the tarball/zipball onto the host runner
    const extract = download.url.endsWith('.zip') ? extractZip : extractTar;
    const extractDirectory = await extract(pathToTarball);

    // Rename the binary
    const binaryDirectory = path.join(
      extractDirectory,
      download.binaryDirectory,
    );
    const binaryPath = getBinaryPath(binaryDirectory, name);
    if (name !== CLI_NAME) {
      await exec('mv', [getBinaryPath(binaryDirectory, CLI_NAME), binaryPath]);
    }

    // Cache the tool
    await cacheFile(binaryPath, name, name, version);

    // Expose the tool by adding it to the PATH
    addPath(binaryDirectory);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
