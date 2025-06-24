import { addPath, getInput, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { cacheFile, downloadTool, extractZip, find } from '@actions/tool-cache';
import path from 'path';

import { getBinaryPath, getDownloadUrl } from './utils';

const DEFAULT_NAME = 'butler';

export async function run() {
  try {
    // Get the version of the tool to be installed
    const cliVersion = getInput('butler-version');
    const cliName = getInput('cli-name') || DEFAULT_NAME;
    const toolName = cliName;

    // Find previously cached directory (if applicable)
    let binaryPath = find(toolName, cliVersion);
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
      if (cliName !== DEFAULT_NAME) {
        await exec('mv', [
          getBinaryPath(extractDirectory, DEFAULT_NAME),
          binaryPath,
        ]);
      }
    }

    // Expose the tool by adding it to the PATH
    addPath(path.dirname(binaryPath));

    // Cache the tool
    /* istanbul ignore else */
    if (!isCached) {
      await cacheFile(binaryPath, cliName, toolName, cliVersion);
    }
  } catch (error) {
    /* istanbul ignore else */
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
