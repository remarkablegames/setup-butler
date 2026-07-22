const mockedOs = vi.hoisted(() => ({
  platform: vi.fn(),
  arch: vi.fn(),
}));

vi.mock('node:os', () => mockedOs);

const { getBinaryPath, getDownloadUrl } = await import('./utils');

const platforms: NodeJS.Platform[] = ['darwin', 'linux', 'win32'];
const architectures = ['arm', 'arm64', 'x32', 'x64'] as NodeJS.Architecture[];

describe('getDownloadUrl', () => {
  const version = '1.2.3';

  const table = platforms.reduce<[NodeJS.Platform, NodeJS.Architecture][]>(
    (testSuites, os) => [
      ...testSuites,
      ...architectures.map(
        (arch) => [os, arch] as [NodeJS.Platform, NodeJS.Architecture],
      ),
    ],
    [],
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each(table)('when platform is %s and arch is %s', (os, arch) => {
    beforeEach(() => {
      mockedOs.platform.mockReturnValue(os);
      mockedOs.arch.mockReturnValue(arch);
    });

    it('returns download object', () => {
      expect(getDownloadUrl(version)).toMatchSnapshot();
    });
  });

  describe('error', () => {
    const arch = 'ia32';

    it(`throws error when architecture is "${arch}"`, () => {
      mockedOs.arch.mockReturnValue(arch);
      mockedOs.platform.mockReturnValue('linux');
      expect(() => {
        getDownloadUrl(version);
      }).toThrow(`Unsupported arch: ${arch}`);
    });

    const platform = 'aix';

    it(`throws error when platform is "${platform}"`, () => {
      mockedOs.arch.mockReturnValue('x64');
      mockedOs.platform.mockReturnValue(platform);
      expect(() => {
        getDownloadUrl(version);
      }).toThrow(`Unsupported platform: ${platform}`);
    });
  });
});

describe('getBinaryPath', () => {
  describe.each(platforms)('when platform is %s', (os) => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockedOs.platform.mockReturnValue(os);
    });

    it('returns CLI path', () => {
      const directory = 'directory';
      const name = 'name';
      expect(getBinaryPath(directory, name)).toMatchSnapshot();
    });
  });
});
