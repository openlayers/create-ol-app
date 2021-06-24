/* eslint-env mocha */
const assert = require('assert');
const fse = require('fs-extra');
const os = require('os');
const path = require('path');
const {main, templates} = require('../src/main.js');

const installTimeout = 5 * 60 * 1000;
const removeTimeout = 30 * 1000;

describe('create-ol-app', () => {
  let tempDir;
  const cwd = process.cwd();

  beforeEach(async function () {
    tempDir = await fse.mkdtemp(path.join(os.tmpdir(), 'create-ol-app-'));
    process.chdir(tempDir);
  });

  afterEach(async function () {
    if (process.env.CI) {
      // Windows CI fails with: EBUSY: resource busy or locked
      // not urgent to clean up there
      return;
    }
    this.timeout(removeTimeout);
    await fse.remove(tempDir);
    process.chdir(cwd);
  });

  it('sets up a project using the default options', async function () {
    this.timeout(installTimeout);
    const projectName = 'test-app';
    await main(['node', 'create-ol-app', projectName]);

    const packageJson = await fse.readJson(
      path.join(projectName, 'package.json')
    );

    assert.strictEqual(packageJson.name, projectName);
  });

  for (const template of templates) {
    it(`works with --template ${template}`, async function () {
      this.timeout(installTimeout);
      const projectName = `test-${template}-app`;
      await main([
        'node',
        'create-ol-app',
        projectName,
        '--template',
        template,
      ]);

      const packageJson = await fse.readJson(
        path.join(projectName, 'package.json')
      );

      assert.strictEqual(packageJson.name, projectName);
    });
  }
});
