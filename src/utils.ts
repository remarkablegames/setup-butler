import os from 'os';
import path from 'path';

const Arch = {
  arm64: 'amd64',
  arm: '386',
  x32: '386',
  x64: 'amd64',
} as const;

/**
 * Gets the operating system CPU architecture.
 *
 * @see {@link https://nodejs.org/api/os.html#os_os_arch}
 *
 * @returns - Return value in [386, amd64]
 */
function getArch() {
  const arch = Arch[os.arch() as keyof typeof Arch];
  if (arch) {
    return arch;
  }
  throw new Error(`Unsupported arch: ${os.arch()}`);
}

enum Platform {
  darwin = 'darwin',
  linux = 'linux',
  win32 = 'windows',
}

/**
 * Gets a string identifying the operating system platform.
 *
 * @see {@link https://nodejs.org/api/os.html#os_os_platform}
 *
 * @returns - Return value in [darwin, linux, windows]
 */
function getPlatform() {
  const platform = Platform[os.platform() as keyof typeof Platform];
  if (platform) {
    return platform;
  }
  throw new Error(`Unsupported platform: ${os.platform()}`);
}

/**
 * Gets download URL.
 *
 * @see {@link https://itch.io/docs/butler/installing.html}
 *
 * @param version - CLI version
 * @returns - Download URL
 */
export function getDownloadUrl(version: string) {
  return `https://broth.itch.zone/butler/${getPlatform()}-${getArch()}/${version}/archive/default`;
}

/**
 * Gets CLI path.
 *
 * @param directory - Directory
 * @param name - CLI name
 * @returns - Binary path
 */
export function getBinaryPath(directory: string, name: string) {
  return path.join(
    directory,
    name + (getPlatform() === Platform.win32 ? '.exe' : ''),
  );
}
