import { jest } from '@jest/globals';

const mockedCore = {
  addPath: jest.fn<typeof import('@actions/core').addPath>(),
  getInput: jest.fn<typeof import('@actions/core').getInput>(),
  setFailed: jest.fn<typeof import('@actions/core').setFailed>(),
};

const mockedExec = {
  exec: jest.fn<typeof import('@actions/exec').exec>(),
};

const mockedTc = {
  cacheFile: jest.fn<typeof import('@actions/tool-cache').cacheFile>(),
  downloadTool: jest.fn<typeof import('@actions/tool-cache').downloadTool>(),
  extractZip: jest.fn<typeof import('@actions/tool-cache').extractZip>(),
  find: jest.fn<typeof import('@actions/tool-cache').find>(),
};

const mockedOs = {
  platform: jest.fn<typeof import('node:os').platform>(),
  arch: jest.fn<typeof import('node:os').arch>(),
};

jest.unstable_mockModule('@actions/core', () => mockedCore);
jest.unstable_mockModule('@actions/exec', () => mockedExec);
jest.unstable_mockModule('@actions/tool-cache', () => mockedTc);

jest.unstable_mockModule('node:os', () => mockedOs);

const { run } = await import('.');

const name = 'cli-name';
const version = '1.2.3';

const path = {
  cli: 'path/to/cli',
  zip: 'path/to/archive.zip',
} as const;

const platforms = ['darwin', 'linux', 'win32'] as const;

afterEach(() => {
  jest.clearAllMocks();
});

describe.each(platforms)('platform is %p', (platform) => {
  beforeEach(() => {
    mockedOs.platform.mockReturnValue(platform);
    mockedOs.arch.mockReturnValue('x64');
  });

  it('downloads, extracts, and adds CLI to PATH', async () => {
    mockedCore.getInput.mockImplementation((input) => {
      switch (input) {
        case 'butler-version':
          return version;
        case 'cli-name':
          return name;
        default:
          throw Error(`Invalid input: ${input}`);
      }
    });

    mockedTc.downloadTool.mockResolvedValueOnce(path.zip);
    mockedTc.extractZip.mockResolvedValueOnce(path.cli);

    await run();

    expect(mockedTc.downloadTool).toHaveBeenCalledWith(
      expect.stringMatching(
        new RegExp(
          `https://broth.itch.zone/butler/[a-zA-Z0-9-]+/${version}/archive/default`,
        ),
      ),
    );

    expect(mockedTc.extractZip).toHaveBeenCalledWith(path.zip);

    expect(mockedExec.exec).toHaveBeenCalledWith('mv', [
      expect.stringContaining(`${path.cli}/butler`),
      expect.stringContaining(`${path.cli}/${name}`),
    ]);

    expect(mockedTc.cacheFile).toHaveBeenCalledWith(
      expect.stringContaining(`${path.cli}/${name}`),
      platform === 'win32' ? `${name}.exe` : name,
      name,
      version,
    );

    expect(mockedCore.addPath).toHaveBeenCalledWith(
      expect.stringContaining(path.cli),
    );
  });
});

describe('error', () => {
  it('throws error', async () => {
    const message = 'error';
    mockedCore.getInput.mockImplementationOnce(() => {
      throw new Error(message);
    });
    await run();
    expect(mockedCore.setFailed).toHaveBeenCalledWith(message);
  });
});
