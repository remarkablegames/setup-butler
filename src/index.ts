import { dirname } from 'node:path';

import { addPath, getInput, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { cacheFile, downloadTool, extractZip, find } from '@actions/tool-cache';

import { getBinaryPath, getDownloadUrl } from './utils';

const TOOL_NAME = 'butler';

export async function run() {
  try {
    // Get the version of the tool to be installed
    const cliVersion = getInput('butler-version');
    const cliName = getInput('cli-name');

    // Find previously cached directory (if applicable)
    let binaryPath = find(cliName, cliVersion);
    const isCached = Boolean(binaryPath);

    /* istanbul ignore else */
    if (!isCached) {
      // Download the specific version of the tool (e.g., tarball/zipball)
      const downloadUrl = getDownloadUrl(cliVersion);
      const pathToTarball = await downloadTool(downloadUrl);

      // Extract the tarball/zipball onto the host runner
      const extractDirectory = await extractZip(pathToTarball);

      // Rename the binary
      binaryPath = getBinaryPath(extractDirectory, cliName);

      /* istanbul ignore else */
      if (cliName !== TOOL_NAME) {
        await exec('mv', [
          getBinaryPath(extractDirectory, TOOL_NAME),
          binaryPath,
        ]);
      }
    }

    // Expose the tool by adding it to the PATH
    addPath(dirname(binaryPath));

    // Cache the tool
    /* istanbul ignore else */
    if (!isCached) {
      const filename = getBinaryPath('', cliName);
      await cacheFile(binaryPath, filename, cliName, cliVersion);
    }
  } catch (error) {
    /* istanbul ignore else */
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
