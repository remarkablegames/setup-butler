import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import os from 'os';

import { run } from '.';

jest.mock('@actions/core');
jest.mock('@actions/exec');
jest.mock('@actions/tool-cache');
jest.mock('os');

const mockedCore = jest.mocked(core);
const mockedExec = jest.mocked(exec);
const mockedTc = jest.mocked(tc);
const mockedOs = jest.mocked(os);

const name = 'cli-name';
const version = '1.2.3';

const path = {
  cli: 'path/to/cli',
  zip: 'path/to/archive.zip',
} as const;

const platforms = ['darwin', 'linux', 'win32'] as const;

afterEach(() => {
  jest.resetAllMocks();
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
          return '';
      }
    });

    mockedTc.downloadTool.mockResolvedValueOnce(path.zip);
    mockedTc.extractZip.mockResolvedValueOnce(path.cli);

    await run();

    expect(mockedTc.downloadTool).toHaveBeenCalledWith(
      expect.stringMatching(
        new RegExp(
          `https://broth.itch.ovh/butler/[a-zA-Z0-9-]+/${version}/archive/default`,
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
      name,
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
