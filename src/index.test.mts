const mockedCore = vi.hoisted(() => ({
  addPath: vi.fn<typeof import('@actions/core').addPath>(),
  getInput: vi.fn<typeof import('@actions/core').getInput>(),
  setFailed: vi.fn<typeof import('@actions/core').setFailed>(),
}));

const mockedExec = vi.hoisted(() => ({
  exec: vi.fn<typeof import('@actions/exec').exec>(),
}));

const mockedTc = vi.hoisted(() => ({
  cacheFile: vi.fn<typeof import('@actions/tool-cache').cacheFile>(),
  downloadTool: vi.fn<typeof import('@actions/tool-cache').downloadTool>(),
  extractZip: vi.fn<typeof import('@actions/tool-cache').extractZip>(),
  find: vi.fn<typeof import('@actions/tool-cache').find>(),
}));

const mockedOs = vi.hoisted(() => ({
  platform: vi.fn<typeof import('node:os').platform>(),
  arch: vi.fn<typeof import('node:os').arch>(),
}));

vi.mock('@actions/core', () => mockedCore);
vi.mock('@actions/exec', () => mockedExec);
vi.mock('@actions/tool-cache', () => mockedTc);

vi.mock('node:os', () => mockedOs);

const { run } = await import('.');

const name = 'cli-name';
const version = '1.2.3';

const path = {
  cli: 'path/to/cli',
  zip: 'path/to/archive.zip',
} as const;

const platforms = ['darwin', 'linux', 'win32'] as const;

afterEach(() => {
  vi.clearAllMocks();
});

describe.each(platforms)('platform is %s', (platform) => {
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
