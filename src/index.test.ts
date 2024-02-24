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

beforeEach(() => {
  jest.resetAllMocks();
});

const name = 'cli-name';
const version = '1.2.3';

describe.each(['darwin', 'win32', 'linux'])('when OS is %p', (os) => {
  beforeEach(() => {
    mockedOs.platform.mockReturnValueOnce(os as NodeJS.Platform);
    mockedOs.arch.mockReturnValueOnce('arm64');
  });

  it('downloads, extracts, and adds CLI in PATH', async () => {
    const pathToTarball = 'path/to/tarball';
    const pathToCLI = 'path/to/cli';

    mockedCore.getInput.mockImplementation((input) => {
      switch (input) {
        case 'cli-version':
          return version;
        case 'cli-name':
          return name;
        default:
          return '';
      }
    });

    mockedTc.downloadTool.mockResolvedValueOnce(pathToTarball);
    const extract = os === 'win32' ? mockedTc.extractZip : mockedTc.extractTar;
    extract.mockResolvedValueOnce(pathToCLI);

    await run();

    expect(mockedTc.downloadTool).toHaveBeenCalledWith(
      expect.stringContaining(
        `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_`,
      ),
    );

    expect(extract).toHaveBeenCalledWith(pathToTarball);

    expect(mockedExec.exec).toHaveBeenCalledWith('mv', [
      expect.stringContaining('/bin/gh'),
      expect.stringContaining(`/bin/${name}`),
    ]);

    expect(mockedTc.cacheFile).toHaveBeenCalledWith(
      expect.stringContaining(`/bin/${name}`),
      name,
      name,
      version,
    );

    expect(mockedCore.addPath).toHaveBeenCalledWith(
      expect.stringContaining(pathToCLI),
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
