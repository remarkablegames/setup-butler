import os from 'os';
import path from 'path';

const architecture = {
  arm: 'arm',
  x32: '386',
  x64: 'amd64',
} as const;

/**
 * Gets the operating system CPU architecture.
 *
 * @see {@link https://nodejs.org/api/os.html#os_os_arch}
 *
 * @param arch - Arch in [arm, x32, x64...]
 * @returns - Return value in [amd64, 386, arm]
 */
function getArch(arch: NodeJS.Architecture) {
  return architecture[arch as keyof typeof architecture] || arch;
}

const platform = {
  darwin: 'macOS',
  linux: 'linux',
  win32: 'windows',
} as const;

/**
 * Gets a string identifying the operating system platform.
 *
 * @see {@link https://nodejs.org/api/os.html#os_os_platform}
 *
 * @param os - OS in [darwin, linux, win32...]
 * @returns - Return value in [darwin, linux, windows]
 */
function getOS(os: NodeJS.Platform) {
  return platform[os as keyof typeof platform] || os;
}

/**
 * Gets download object.
 *
 * @see {@link https://github.com/cli/cli/releases}
 *
 * @param version - CLI version
 * @returns - URL and binary path
 */
export function getDownloadObject(version: string) {
  const platform = os.platform();
  const arch = os.arch() as NodeJS.Architecture;

  const filename = `gh_${version}_${getOS(platform)}_${getArch(arch)}`;
  const extension = platform === 'win32' ? 'zip' : 'tar.gz';

  return {
    binaryDirectory: platform === 'win32' ? 'bin' : path.join(filename, 'bin'),
    url: `https://github.com/cli/cli/releases/download/v${version}/${filename}.${extension}`,
  };
}

/**
 * Gets CLI path.
 *
 * @param directory - Directory
 * @param name - CLI name
 * @returns - Binary path
 */
export function getBinaryPath(directory: string, name: string) {
  return path.join(directory, name + (os.platform() === 'win32' ? '.exe' : ''));
}
