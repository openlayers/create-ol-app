#!/usr/bin/env node
const path = require('path');
const {Command, Option} = require('commander');
const packageJson = require('../package.json');
const degit = require('degit');
const validatePackageName = require('validate-npm-package-name');
const fse = require('fs-extra');
const {spawn} = require('child_process');

// must be a corresponding openlayers/ol-<template> project, first is default
const templates = ['vite', 'esbuild', 'webpack', 'rollup', 'parcel'];
exports.templates = templates;

async function main(args) {
  const {projectDir, options} = parseArgs(args);
  const packageName = path.basename(projectDir);

  const {
    validForNewPackages: valid,
    errors,
    warnings,
  } = validatePackageName(packageName);

  if (!valid) {
    const issues = (errors || []).concat(warnings || []);
    process.stderr.write(
      `\nPackage name rules:\n${issues.map((issue) => '\n * ' + issue)}\n`
    );
    throw new Error(`Invalid package name: ${packageName}`);
  }

  await cloneTemplate(projectDir, options.template);
  await updatePackageJson(projectDir, packageName);
  await installDependencies(projectDir);
}

exports.main = main;

function parseArgs(args) {
  let projectDir;
  const program = new Command(packageJson.name);
  program
    .description('Create an OpenLayers application based on a template.')
    .version(packageJson.version)
    .arguments('[project-directory]')
    .addOption(
      new Option('-t, --template <name>', 'project template name')
        .default(templates[0])
        .choices(templates)
    )
    .usage('[project-directory] [options]')
    .action((dir) => {
      projectDir = path.resolve(dir || '.');
    });

  program.parse(args);

  return {projectDir, options: program.opts()};
}

async function cloneTemplate(dir, templateName) {
  const template = `openlayers/ol-${templateName}`;
  await degit(template).clone(dir, {cache: false});
}

async function updatePackageJson(dir, packageName) {
  const appPackageJsonPath = path.join(dir, 'package.json');
  const appPackageJson = await fse.readJson(appPackageJsonPath);
  appPackageJson.name = packageName;
  await fse.writeJson(appPackageJsonPath, appPackageJson, {spaces: 2});
}

function installDependencies(dir) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['ci'], {
      cwd: dir,
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error('npm install failed'));
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  main(process.argv).catch((error) =>
    process.stderr.write(`\n${error.message}\n`, () => process.exit(1))
  );
}
