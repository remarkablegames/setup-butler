import { arch, platform } from 'node:os';
import { join } from 'node:path';

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
  const currentArch = Arch[arch() as keyof typeof Arch];
  if (currentArch) {
    return currentArch;
  }
  throw new Error(`Unsupported arch: ${arch()}`);
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
  const currentPlatform = Platform[platform() as keyof typeof Platform];
  if (currentPlatform) {
    return currentPlatform;
  }
  throw new Error(`Unsupported platform: ${platform()}`);
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
  return join(
    directory,
    name + (getPlatform() === Platform.win32 ? '.exe' : ''),
  );
}
